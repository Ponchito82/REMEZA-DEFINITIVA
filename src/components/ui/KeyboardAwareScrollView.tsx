import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  LayoutChangeEvent,
  Platform,
  ScrollView,
  ScrollViewProps,
  TextInput,
  View,
} from "react-native";

type Props = ScrollViewProps & {
  /**
   * Espacio que debe quedar visible bajo el campo enfocado (el boton que
   * sigue, el mensaje de error...). En dp.
   */
  revealBelow?: number;
};

/**
 * ScrollView que se acomoda al teclado del telefono: cuando aparece, sube el
 * contenido lo necesario para que el campo enfocado (y lo que sigue debajo)
 * quede sobre el teclado, y agrega espacio al final para que siempre haya
 * recorrido suficiente.
 *
 * La ventana ya se redimensiona sola (`adjustResize`), pero eso solo achica el
 * area visible: no mueve el contenido, y un boton bajo el campo quedaba tapado.
 *
 * Se mide todo con `measureInWindow`, asi no depende del desplazamiento
 * actual ni de que el llamador registre `onScroll`.
 */
const KeyboardAwareScrollView = React.forwardRef<ScrollView, Props>(
  function KeyboardAwareScrollView(
    { revealBelow = 170, children, onLayout, ...rest },
    forwardedRef,
  ) {
    const innerRef = useRef<ScrollView | null>(null);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const keyboardVisible = useRef(false);

    const setRefs = useCallback(
      (node: ScrollView | null) => {
        innerRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef],
    );

    /** Sube el contenido lo justo para que el campo enfocado quede sobre el teclado. */
    const reveal = useCallback(() => {
      const scroll = innerRef.current;
      const inner = (scroll as unknown as { getInnerViewRef?: () => unknown } | null)?.getInnerViewRef?.();
      const focused = TextInput.State.currentlyFocusedInput?.();
      if (!scroll || !inner || !focused) return;

      // measureInWindow: [x, y, ancho, alto] respecto de la ventana.
      (scroll as unknown as View).measureInWindow((_sx, scrollTop, _sw, scrollHeight) => {
        (inner as unknown as View).measureInWindow((_ix, innerTop) => {
          (focused as unknown as View).measureInWindow((_fx, fieldTop, _fw, fieldHeight) => {
            const offset = scrollTop - innerTop;
            const fieldBottom = fieldTop + fieldHeight;

            // El campo es de otra pantalla u otro scroll: no es de este.
            if (fieldBottom < scrollTop || fieldTop > scrollTop + scrollHeight) return;

            // La ventana ya se achico por el teclado, asi que el borde de este
            // scroll es el limite visible. `screenY` del evento no sirve: no
            // cuenta la franja de sugerencias de algunos teclados.
            const overshoot = fieldBottom + revealBelow - (scrollTop + scrollHeight);
            if (overshoot > 0) {
              scroll.scrollTo({ y: Math.max(offset + overshoot, 0), animated: true });
            }
          });
        });
      });
    }, [revealBelow]);

    useEffect(() => {
      const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
      const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
      let timers: ReturnType<typeof setTimeout>[] = [];
      const clearTimers = () => {
        timers.forEach(clearTimeout);
        timers = [];
      };

      const showSub = Keyboard.addListener(showEvent, (event) => {
        setKeyboardHeight(event.endCoordinates.height);
        keyboardVisible.current = true;
        // Dos pasadas: la segunda corrige si el espacio extra o el
        // redimensionado de la ventana llegaron despues de la primera.
        clearTimers();
        timers = [setTimeout(reveal, 120), setTimeout(reveal, 400)];
      });
      const hideSub = Keyboard.addListener(hideEvent, () => {
        setKeyboardHeight(0);
        keyboardVisible.current = false;
        clearTimers();
      });

      return () => {
        clearTimers();
        showSub.remove();
        hideSub.remove();
      };
    }, [reveal]);

    /**
     * Algunos teclados cambian de alto despues de aparecer (la franja de
     * sugerencias o de autocompletar) y Android no avisa con ningun evento:
     * solo se nota porque el area visible de este scroll cambia.
     */
    const handleLayout = useCallback(
      (event: LayoutChangeEvent) => {
        onLayout?.(event);
        if (keyboardVisible.current) setTimeout(reveal, 60);
      },
      [onLayout, reveal],
    );

    return (
      <ScrollView ref={setRefs} onLayout={handleLayout} {...rest}>
        {children}
        {keyboardHeight > 0 ? <View style={{ height: revealBelow }} /> : null}
      </ScrollView>
    );
  },
);

export default KeyboardAwareScrollView;
