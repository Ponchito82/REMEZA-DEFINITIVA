import React from "react";
import { ScrollView, View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { User, Mail, MapPin } from "lucide-react-native";

import {
  Button,
  CloseButton,
  GlassBanner,
  ScreenHeader,
  TextField,
} from "../components/ui";
import { AvatarPicker } from "../components/remeza";
import { spacing, screenPadding } from "../theme/spacing";
import { ViewName } from "../types/app";

type Props = {
  t: any;
  setView: (view: ViewName) => void;

  profileFullName: string;

  profileEmail: string;
  setProfileEmail: (v: string) => void;

  profileAddress: string;
  setProfileAddress: (v: string) => void;

  profileSaved: boolean;
  handleProfileSave: () => void;
};

export default function ProfileView({
  t,
  setView,
  profileFullName,
  profileEmail,
  setProfileEmail,
  profileAddress,
  setProfileAddress,
  profileSaved,
  handleProfileSave,
}: Props) {
  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <CloseButton testID="profile-backButton" onPress={() => setView("dashboard")} />

        <ScreenHeader
          title={t.profileTitle}
          subtitle={t.personalInfoSubtitle}
          style={styles.header}
        />

        <AvatarPicker style={styles.avatar} />

        <View style={styles.form}>
          <TextField
            testID="profile-fullNameInput"
            label={t.fullName}
            placeholder={t.fullNamePlaceholder}
            leftIcon={User}
            value={profileFullName}
          />

          <TextField
            testID="profile-emailInput"
            label={t.emailAddress}
            placeholder={t.emailPlaceholder}
            leftIcon={Mail}
            value={profileEmail}
            onChangeText={setProfileEmail}
            keyboardType="email-address"
          />

          <TextField
            testID="profile-addressInput"
            label={t.deliveryAddress}
            placeholder={t.deliveryAddressPlaceholder}
            leftIcon={MapPin}
            value={profileAddress}
            onChangeText={setProfileAddress}
          />

          <Button
            testID="profile-saveButton"
            title={t.saveChanges}
            onPress={handleProfileSave}
            radius="pill"
          />

          {profileSaved ? <GlassBanner tone="info" message={t.profileUpdated} /> : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: screenPadding,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginTop: spacing.xxl,
  },
  avatar: {
    marginBottom: spacing.xxl,
  },
  form: {
    gap: spacing.lg,
  },
});
