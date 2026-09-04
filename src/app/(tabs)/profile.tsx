import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/authContext";
import { supabase } from "../../lib/supabase";

export default function Profile() {
  const { profile, signOut } = useAuth();
  const router = useRouter();

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const username =
    profile?.username 
    ||
    "-";

  const email = profile?.email || null

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.push({
              pathname: '/(auth)/login',
            })
        },
      },
    ]);
  };
  

  // 2. Fungsi Upload ke Supabase Storage & Update Row Database
  const uploadAndSaveAvatar = async (imageUri: string) => {
    try {
      setUploading(true);

      // Konversi URI menjadi ArrayBuffer
      const response = await fetch(imageUri);
      const arrayBuffer = await response.arrayBuffer();

      const fileExt = imageUri.split(".").pop() || "jpg";

      // Gunakan user.id + timestamp sebagai nama file
      const fileName = `${profile?.user_id}_${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // A. Upload file ke Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("Profile_Image") // Pastikan bucket nama ini sudah diset Public di Supabase
        .upload(filePath, arrayBuffer, {
          contentType: `image/${fileExt}`,
          upsert: true, // Menimpa file lama jika nama filenya sama
        });

      if (uploadError) throw uploadError;

      // B. Ambil Public URL dari file yang baru diunggah
      const { data } = supabase.storage
        .from("Profile_Image")
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      // C. Update URL avatar di Database Supabase (tabel profiles)
      const { error: updateError } = await supabase
        .from("users")
        .update({ img_url: publicUrl })
        .eq("user_id", profile?.user_id);

      if (updateError) throw updateError;

      // Optional: Delete old profile picture if any
      if (profileImage) {
        // Ambil nama file dari URL lama
        const oldFileName = profileImage.split('/').pop(); 
        if (oldFileName) {
          const { error: error_del } = await supabase.storage
            .from("Profile_Image")
            .remove([`avatars/${oldFileName}`]);

            if (error_del) throw error_del;
        }
      }

      // D. Set local state dengan URL baru
      setProfileImage(publicUrl);
      Alert.alert("Success", "Profile picture has been updated");
    } finally {
      setUploading(false);
    }
  };

  // 3. Fungsi Memilih Gambar
  const pickProfilePicture = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photos to change your profile picture."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      // Langsung proses upload setelah memilih gambar
      await uploadAndSaveAvatar(selectedUri);
    }
  };

  async function fetchImg(){
      const {data: img, error} = await supabase
      .from("users")
      .select("img_url")
      .eq("user_id", profile?.user_id)

      if (error) {
        console.log(error);
        return;
      }

      setProfileImage(img[0].img_url);
  }

  useFocusEffect(
    useCallback(() => {
      fetchImg();
    }, [profile?.user_id])
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Profile</Text>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Pressable
          style={styles.avatarContainer}
          onPress={pickProfilePicture}
        >
          {profileImage ? (
            <Image
              source={{ uri: profileImage}}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.defaultAvatar}>
              <Ionicons name="person" size={58} color="#9CA3AF" />
            </View>
          )}

          {/* Edit Button */}
          <View style={styles.editButton}>
            <Ionicons name="camera" size={17} color="#FFFFFF" />
          </View>
        </Pressable>

        <Text style={styles.username}>{username}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      {/* Sign Out */}
      <View style={styles.bottomSection}>
        <Pressable
          style={({ pressed }) => [
            styles.signOutButton,
            pressed && styles.pressed,
          ]}
          onPress={handleSignOut}
        >
          <Ionicons name="log-out-outline" size={21} color="#EF4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },

  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginTop: 16,
  },

  profileSection: {
    alignItems: "center",
    marginTop: 200,
  },

  avatarContainer: {
    width: 120,
    height: 120,
    position: "relative",
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  defaultAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },

  editButton: {
    position: "absolute",
    right: 2,
    bottom: 2,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },

  username: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginTop: 18,
  },

  email: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 5,
  },

  bottomSection: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 20,
    marginBottom: 170
  },

  signOutButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#FEF2F2",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  signOutText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#EF4444",
  },

  pressed: {
    opacity: 0.7,
  },
});
