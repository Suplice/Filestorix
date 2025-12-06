import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { TaskQuestion } from "@/lib/types/task";
import { RNInput } from "@/components/nativeComponents";

type QuestionRendererProps = {
  question: TaskQuestion;
  options: string[];
  answer: string;
  onAnswerChange: (answer: string) => void;
  disabled: boolean;
};

export function QuestionRenderer({
  question,
  options,
  answer,
  onAnswerChange,
  disabled,
}: QuestionRendererProps) {
  if (question.type === "QUIZ") {
    return (
      <View>
        <Text style={styles.questionText}>{question.question_text}</Text>
        <View style={{ gap: 12 }}>
          {options.map((option, index) => {
            const isSelected = answer === option;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => !disabled && onAnswerChange(option)}
                activeOpacity={0.7}
                style={[
                  styles.optionButton,
                  isSelected && styles.optionSelected,
                ]}
              >
                <View
                  style={[
                    styles.radioCircle,
                    isSelected && styles.radioSelected,
                  ]}
                />
                <Text
                  style={[styles.optionText, isSelected && { color: "#fff" }]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  if (question.type === "FILL_BLANK") {
    const parts = question.question_text.split("___");
    const preText = parts[0];
    const postText = parts.length > 1 ? parts[1] : "";

    return (
      <View>
        <View style={styles.fillBlankContainer}>
          <Text style={styles.questionTextLg}>{preText}</Text>
          <TextInput
            style={styles.inlineInput}
            value={answer}
            onChangeText={onAnswerChange}
            editable={!disabled}
            placeholder="..."
            placeholderTextColor="#64748b"
            autoCapitalize="none"
          />
          <Text style={styles.questionTextLg}>{postText}</Text>
        </View>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.questionText}>{question.question_text}</Text>
      <RNInput
        value={answer}
        onChangeText={onAnswerChange}
        placeholder="Type answer..."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  questionText: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "600",
  },
  questionTextLg: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 32,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  optionSelected: {
    borderColor: "#6366f1",
    backgroundColor: "rgba(99, 102, 241, 0.1)",
  },
  optionText: { color: "#cbd5e1", fontSize: 16, flex: 1 },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#64748b",
    marginRight: 12,
  },
  radioSelected: { borderColor: "#6366f1", backgroundColor: "#6366f1" },
  fillBlankContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  inlineInput: {
    backgroundColor: "#0f172a",
    color: "#fff",
    borderBottomWidth: 2,
    borderBottomColor: "#6366f1",
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 80,
    textAlign: "center",
    fontSize: 18,
    marginHorizontal: 4,
  },
});
