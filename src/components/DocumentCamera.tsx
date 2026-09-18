import React, { useRef, useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, Image, Alert } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  usePhotoOutput,
} from "react-native-vision-camera";
import { X, Camera as CameraIcon, RotateCcw, Check } from "lucide-react-native";

type Props = {
  side: "front" | "back";
  onClose: () => void;
  onCapture: (path: string) => void;
};

export default function DocumentCamera({ side, onClose, onCapture }: Props) {
  const camera = useRef<any>(null);
  const device = useCameraDevice("back");
  const photoOutput = usePhotoOutput({});
  const { hasPermission, requestPermission } = useCameraPermission();

  const [previewPath, setPreviewPath] = useState<string | null>(null);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const takePhoto = async () => {
    try {
      if (!photoOutput) {
        Alert.alert("Error", "La cámara todavía no está lista.");
        return;
      }

      const result = await photoOutput.capturePhotoToFile({}, {});

      if (!result?.filePath) {
        Alert.alert("Error", "No fue posible tomar la fotografía.");
        return;
      }

      setPreviewPath(result.filePath);
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "No fue posible tomar la fotografía.");
    }
  };

  const retakePhoto = () => {
    setPreviewPath(null);
  };

  const usePhoto = () => {
    if (!previewPath) return;
    onCapture(previewPath);
  };

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Camera permission required</Text>
        <Pressable style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Enable camera</Text>
        </Pressable>
        <Pressable style={styles.closeTextButton} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </Pressable>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Camera unavailable</Text>
        <Pressable style={styles.closeTextButton} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </Pressable>
      </View>
    );
  }

  if (previewPath) {
    return (
      <View style={styles.container}>
        <Image
          source={{
            uri: previewPath.startsWith("file://") ? previewPath : `file://${previewPath}`,
          }}
          style={StyleSheet.absoluteFill}
          resizeMode="contain"
        />

        <View style={styles.previewOverlay}>
          <View style={styles.header}>
            <Pressable testID="register-cameraCloseButton" style={styles.closeButton} onPress={onClose}>
              <X size={28} color="#FFFFFF" />
            </Pressable>

            <Text style={styles.title}>Review photo</Text>

            <View style={{ width: 44 }} />
          </View>

          <View style={styles.previewBottom}>
            <Text style={styles.previewText}>
              Make sure the document is clear and all four corners are visible.
            </Text>

            <View style={styles.previewButtons}>
              <Pressable testID="register-cameraRetakeButton" style={styles.retakeButton} onPress={retakePhoto}>
                <RotateCcw size={22} color="#FFFFFF" />
                <Text style={styles.retakeButtonText}>Retake</Text>
              </Pressable>

              <Pressable testID="register-cameraUsePhotoButton" style={styles.usePhotoButton} onPress={usePhoto}>
                <Check size={22} color="#FFFFFF" />
                <Text style={styles.usePhotoButtonText}>Use photo</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        outputs={[photoOutput]}
      />

      <View style={styles.overlay}>
        <View style={styles.header}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <X size={28} color="#FFFFFF" />
          </Pressable>

          <Text style={styles.title}>{side === "front" ? "Front of your ID" : "Back of your ID"}</Text>

          <View style={{ width: 44 }} />
        </View>

        <Text style={styles.instructions}>Place your document inside the frame</Text>

        <View style={styles.guideContainer}>
          <Image
            source={require("../assets/id-card-guide.png")}
            style={styles.guide}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.helpText}>Make sure all four corners are visible</Text>

        <View style={styles.captureContainer}>
          <Pressable testID="register-cameraCaptureButton" style={styles.captureOuter} onPress={takePhoto}>
            <View style={styles.captureInner}>
              <CameraIcon size={30} color="#512BD4" />
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  center: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  message: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
  permissionButton: {
    marginTop: 25,
    backgroundColor: "#512BD4",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  closeTextButton: {
    marginTop: 20,
  },
  closeText: {
    color: "#FFFFFF",
    fontSize: 15,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  instructions: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 15,
    marginTop: 25,
  },
  guideContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  guide: {
    width: "95%",
    height: 260,
  },
  helpText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 14,
    marginBottom: 30,
  },
  captureContainer: {
    alignItems: "center",
  },
  captureOuter: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  captureInner: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 40,
    justifyContent: "space-between",
  },
  previewBottom: {
    backgroundColor: "rgba(0,0,0,0.65)",
    borderRadius: 20,
    padding: 18,
  },
  previewText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 14,
    marginBottom: 18,
  },
  previewButtons: {
    flexDirection: "row",
    gap: 12,
  },
  retakeButton: {
    flex: 1,
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 14,
  },
  retakeButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  usePhotoButton: {
    flex: 1,
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#512BD4",
    borderRadius: 14,
  },
  usePhotoButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
