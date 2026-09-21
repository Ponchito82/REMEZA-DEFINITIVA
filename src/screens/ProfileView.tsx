import React from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
} from "react-native";
import { X, User, CheckCircle2 } from "lucide-react-native";

import { styles } from "../theme/styles";
import FormInput from "../components/FormInput";
import MainButton from "../components/MainButton";
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
    <View style={styles.pageScreen}>
      <ScrollView
        contentContainerStyle={styles.pageContent}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          testID="profile-backButton"
          onPress={() => setView("dashboard")}
          style={styles.backButton}
        >
          <X size={24} color="#111827" />
        </Pressable>

        <Text style={styles.pageTitle}>{t.profileTitle}</Text>
        <Text style={styles.pageSubtitle}>
          {t.personalInfoSubtitle}
        </Text>

        <View style={styles.profileAvatarWrap}>
          <View style={styles.profileAvatar}>
            <User size={48} color="#64748B" />
          </View>
        </View>

        <View style={styles.stack16}>
          <FormInput
            testID="profile-fullNameInput"
            label={t.fullName}
            value={profileFullName}
          />

          <FormInput
            testID="profile-emailInput"
            label={t.emailAddress}
            value={profileEmail}
            onChangeText={setProfileEmail}
            keyboardType="email-address"
          />

          <FormInput
            testID="profile-addressInput"
            label={t.deliveryAddress}
            value={profileAddress}
            onChangeText={setProfileAddress}
          />

          <MainButton testID="profile-saveButton" onPress={handleProfileSave}>
            {t.saveChanges}
          </MainButton>

          {profileSaved && (
            <View style={styles.transferSuccessBox}>
              <CheckCircle2 size={18} color="#16A34A" />
              <Text style={styles.transferSuccessText}>
                {t.profileUpdated}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}