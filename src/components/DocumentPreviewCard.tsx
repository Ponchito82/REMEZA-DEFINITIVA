import React from "react";
import { View, Text, Image, Pressable, ActivityIndicator } from "react-native";
import { FileText, Trash2, RotateCcw, Check, AlertCircle, Upload } from "lucide-react-native";
import { styles } from "../theme/styles";
import { PURPLE } from "../theme/colors";

export type DocumentStatus = "empty" | "loaded" | "uploading" | "error";

type Props = {
  t: any;
  label: string;
  filePath: string | null;
  status: DocumentStatus;
  errorMessage?: string;
  onPick: () => void;
  onRemove: () => void;
  testID?: string;
};

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "heic"];

export function fileNameOf(filePath: string): string {
  const clean = filePath.split("?")[0];
  const parts = clean.split(/[\\/]/);
  return parts[parts.length - 1] || clean;
}

export function extensionOf(filePath: string): string {
  const name = fileNameOf(filePath);
  const dot = name.lastIndexOf(".");
  return dot === -1 ? "" : name.slice(dot + 1).toLowerCase();
}

export function isImageFile(filePath: string): boolean {
  return IMAGE_EXTENSIONS.includes(extensionOf(filePath));
}

export function isPdfFile(filePath: string): boolean {
  return extensionOf(filePath) === "pdf";
}

function toUri(filePath: string): string {
  return filePath.startsWith("file://") || filePath.startsWith("content://")
    ? filePath
    : `file://${filePath}`;
}

function fileTypeLabel(t: any, filePath: string): string {
  if (isPdfFile(filePath)) return t.documentTypePdf;
  if (isImageFile(filePath)) return t.documentTypeImage;
  const extension = extensionOf(filePath);
  return extension ? extension.toUpperCase() : t.documentTypeFile;
}

export default function DocumentPreviewCard({
  t,
  label,
  filePath,
  status,
  errorMessage,
  onPick,
  onRemove,
  testID,
}: Props) {
  if (!filePath || status === "empty") {
    return (
      <View style={styles.documentCard}>
        <Text style={styles.documentCardLabel}>{label}</Text>

        <Pressable
          testID={testID}
          onPress={onPick}
          style={({ pressed }) => [styles.documentEmptyRow, pressed && { opacity: 0.8 }]}
        >
          <View style={styles.documentThumbEmpty}>
            <Upload size={22} color={PURPLE} />
          </View>

          <View style={styles.documentInfo}>
            <Text style={styles.documentName}>{t.uploadDocument}</Text>
            <Text style={styles.documentMeta}>{t.noFileSelected}</Text>
          </View>
        </Pressable>
      </View>
    );
  }

  const uri = toUri(filePath);
  const showImage = isImageFile(filePath);

  return (
    <View style={styles.documentCard} testID={testID ? `${testID}-card` : undefined}>
      <Text style={styles.documentCardLabel}>{label}</Text>

      <View style={styles.documentRow}>
        {showImage ? (
          <Image
            source={{ uri }}
            style={styles.documentThumb}
            resizeMode="cover"
            testID={testID ? `${testID}-thumb` : undefined}
          />
        ) : (
          <View
            style={[styles.documentThumb, styles.documentThumbFile]}
            testID={testID ? `${testID}-thumb` : undefined}
          >
            <FileText size={24} color={PURPLE} />
            <Text style={styles.documentThumbBadge}>
              {isPdfFile(filePath) ? "PDF" : extensionOf(filePath).toUpperCase() || "?"}
            </Text>
          </View>
        )}

        <View style={styles.documentInfo}>
          <Text style={styles.documentName} numberOfLines={1}>
            {fileNameOf(filePath)}
          </Text>
          <Text style={styles.documentMeta}>{fileTypeLabel(t, filePath)}</Text>

          {status === "uploading" ? (
            <View style={styles.documentStatusRow} testID={testID ? `${testID}-uploading` : undefined}>
              <ActivityIndicator size="small" color={PURPLE} />
              <Text style={styles.documentMeta}>{t.documentUploading}</Text>
            </View>
          ) : status === "error" ? (
            <View style={styles.documentStatusRow} testID={testID ? `${testID}-error` : undefined}>
              <AlertCircle size={14} color="#EF4444" />
              <Text style={styles.documentErrorText} numberOfLines={2}>
                {errorMessage || t.documentError}
              </Text>
            </View>
          ) : (
            <View style={styles.documentStatusRow} testID={testID ? `${testID}-loaded` : undefined}>
              <Check size={14} color="#16A34A" />
              <Text style={styles.documentOkText}>{t.documentLoaded}</Text>
            </View>
          )}
        </View>

        <View style={styles.documentActions}>
          <Pressable
            testID={testID ? `${testID}-replaceButton` : undefined}
            onPress={onPick}
            disabled={status === "uploading"}
            hitSlop={8}
            style={({ pressed }) => [
              styles.documentActionButton,
              status === "uploading" && { opacity: 0.4 },
              pressed && { opacity: 0.7 },
            ]}
          >
            <RotateCcw size={18} color="#4B5563" />
          </Pressable>

          <Pressable
            testID={testID ? `${testID}-removeButton` : undefined}
            onPress={onRemove}
            disabled={status === "uploading"}
            hitSlop={8}
            style={({ pressed }) => [
              styles.documentActionButton,
              status === "uploading" && { opacity: 0.4 },
              pressed && { opacity: 0.7 },
            ]}
          >
            <Trash2 size={18} color="#EF4444" />
          </Pressable>
        </View>
      </View>

      {status === "error" ? (
        <Pressable
          testID={testID ? `${testID}-retryButton` : undefined}
          onPress={onPick}
          style={({ pressed }) => [styles.documentRetry, pressed && { opacity: 0.8 }]}
        >
          <Text style={styles.documentRetryText}>{t.documentRetry}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
