import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { defaultStyles } from "@/constants/DefaultStyles";
import { Entypo, Ionicons } from "@expo/vector-icons";
import ProjectPreview from "@/components/projects/project-preview";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { useProfileStore } from "@/utils/store/profile-store";
import { supabase } from "@/utils/supabase";
import { Project } from "@/utils/store/project-store";

const DiscoverProjects = () => {
  const fullName = useProfileStore((state) => state.fullName);

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const getProjects = async () => {
      const { data, error } = await supabase.from("projects").select();
      if (error) {
        alert(error.message);
        return;
      }

      const processedData = data.map((project) => ({
        ...project,
        maxGroupSize: project.max_group_size,
        minGroupSize: project.min_group_size,
        projectId: project.project_id,
        startDate: new Date(project.start_date),
        startTime: project.start_time,
        image:
          "https://cdn.pixabay.com/photo/2017/07/31/11/21/people-2557396_1280.jpg",
      }));

      setProjects(processedData);
    };
    getProjects();
  }, []);

  return (
    <View>
      <LinearGradient
        // Background Linear Gradient
        colors={[Colors.primaryMuted, "#fff"]}
        style={{ height: "100%" }}
        locations={[0, 1]} // Adjust the second value to make the transition earlier or later
      >
        <SafeAreaView>
          <ScrollView contentContainerStyle={{ height: "100%" }}>
            <View style={{ paddingHorizontal: 24 }}>
              <TouchableOpacity
                style={{
                  alignSelf: "flex-end",
                  marginTop: 12,
                }}
                onPress={() =>
                  router.navigate("/(authenticated)/projects/add-project")
                }
              >
                <View style={{ borderRadius: 8, overflow: "hidden" }}>
                  <BlurView
                    tint="extraLight"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.05)",
                      borderRadius: 8,
                      flexDirection: "row",
                      alignItems: "center",
                      paddingLeft: 8,
                      paddingVertical: 4,
                      paddingRight: 4,
                      gap: 4,
                    }}
                    intensity={80}
                  >
                    <Text
                      style={{
                        color: Colors.dark,
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      Create
                    </Text>
                    <Entypo name="plus" size={24} color={Colors.primary} />
                  </BlurView>
                </View>
              </TouchableOpacity>
              <View style={{ marginTop: 32 }}>
                <Text style={{ fontSize: 32, fontWeight: "bold" }}>
                  Hello, {fullName}
                </Text>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: "bold",
                    color: Colors.primary,
                  }}
                >
                  There are {projects.length} new projects in your area.
                </Text>
              </View>
              <View style={[defaultStyles.textInput, styles.textInputView]}>
                <Ionicons name="search" size={20} color={Colors.gray} />

                <TextInput
                  style={{ flex: 1, marginLeft: 8, fontSize: 16 }}
                  placeholder="Search for a project"
                  cursorColor={Colors.primary}
                />
              </View>
              <Text style={{ marginTop: 56, fontSize: 24, fontWeight: "600" }}>
                You might like
              </Text>
            </View>

            <View>
              <ScrollView
                style={{ marginTop: 12 }}
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                {projects.map((project, i) => (
                  <ProjectPreview project={project} key={i} />
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default DiscoverProjects;

const styles = StyleSheet.create({
  textInputView: {
    marginTop: 32,
    flexDirection: "row",
  },
});
