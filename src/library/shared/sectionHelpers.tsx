import * as React from "react";
import "./typography.css";
import type { ComplexImageType, ImageType } from "@yext/pages-components";
import {
  MaybeRTF,
  getThemeColorCssValue,
  isDarkColor,
  type ComprehensiveCTAValue,
  type MaybeRTFProps,
  type RichText,
  type StreamDocument,
  type StyledImageValue,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableAssetImage,
  type TranslatableRichText,
  type TranslatableString,
  type YextEntityField,
} from "@yext/visual-editor";

export type SectionProps = {
  backgroundColor: ThemeColor;
  visibleOnLivePage: boolean;
};

export type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

export type StyledTextStyleProps = {
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

export type StyledRtfProps = {
  text: YextEntityField<TranslatableRichText>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

export type StyledImageProps = {
  image: YextEntityField<ImageType | ComplexImageType | TranslatableAssetImage>;
  aspectRatio: number;
  imageConstrain: "fixed" | "filled";
  styles?: StyledImageValue;
};

/** Options formerly exposed as ThemeOptions.ASPECT_RATIO. */
export const aspectRatioOptions = [
  { label: "1:1", value: 1 },
  { label: "5:4", value: 1.25 },
  { label: "4:3", value: 1.33 },
  { label: "3:2", value: 1.5 },
  { label: "5:3", value: 1.67 },
  { label: "16:9", value: 1.78 },
  { label: "2:1", value: 2 },
  { label: "3:1", value: 3 },
  { label: "4:1", value: 4 },
  { label: "4:5", value: 0.8 },
  { label: "3:4", value: 0.75 },
  { label: "2:3", value: 0.67 },
];

export const createDefaultStyledTextValue = (): StyledTextValue => ({
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
});

export const createDefaultCardCta = (
  label: string,
): ComprehensiveCTAValue => ({
  data: {
    actionType: "link",
    cta: {
      field: "",
      selectedType: "textAndLink",
      constantValue: {
        label: { defaultValue: label },
        link: "#",
        linkType: "URL",
        ctaType: "textAndLink",
        openInNewTab: false,
        normalizeLink: false,
      },
      constantValueEnabled: true,
    },
    openInNewTab: false,
    buttonText: { defaultValue: "Button" },
    customId: "",
    customClass: "",
    dataAttributes: [],
    ariaLabel: { defaultValue: label },
  },
  styles: {
    variant: "link",
    button: {
      ...createDefaultStyledTextValue(),
      borderRadius: "default",
      letterSpacing: "default",
    },
    link: {
      ...createDefaultStyledTextValue(),
      includeCaret: "none",
      letterSpacing: "default",
    },
  },
});

export const getTextStyles = (
  styles: StyledTextValue,
  fontColor?: ThemeColor,
  surfaceColor?: ThemeColor,
  streamDocument?: StreamDocument,
): React.CSSProperties => ({
  color:
    getThemeColorCssValue(fontColor) ??
    (surfaceColor
      ? isDarkColor(surfaceColor, streamDocument)
        ? "#fff"
        : "#000"
      : undefined),
  fontFamily: styles.fontFamily === "default" ? undefined : styles.fontFamily,
  fontSize: styles.fontSize === "default" ? undefined : styles.fontSize,
  fontWeight: styles.fontWeight === "default" ? undefined : styles.fontWeight,
  fontStyle: styles.fontStyle === "default" ? undefined : styles.fontStyle,
  textTransform:
    styles.textTransform === "default" ? undefined : styles.textTransform,
});

export const getRichTextStyleOverrides = (
  styles: StyledTextValue,
  fontColor?: ThemeColor,
  surfaceColor?: ThemeColor,
  streamDocument?: StreamDocument,
): NonNullable<MaybeRTFProps["richTextStyleOverrides"]> => ({
  ...styles,
  color:
    getThemeColorCssValue(fontColor) ??
    (surfaceColor
      ? isDarkColor(surfaceColor, streamDocument)
        ? "#fff"
        : "#000"
      : undefined),
});

export const renderResolvedRichText = (
  value: unknown,
  richTextStyleOverrides?: MaybeRTFProps["richTextStyleOverrides"],
): React.ReactNode => {
  if (React.isValidElement(value)) {
    if (!richTextStyleOverrides) {
      return value;
    }

    const resolvedColor =
      typeof richTextStyleOverrides.color === "string"
        ? richTextStyleOverrides.color
        : getThemeColorCssValue(richTextStyleOverrides.color);

    return React.cloneElement(
      value as React.ReactElement<{ style?: React.CSSProperties }>,
      {
        style: {
          ...(value.props as { style?: React.CSSProperties }).style,
          ...richTextStyleOverrides,
          color: resolvedColor,
        },
      },
    );
  }

  const data =
    typeof value === "string" ||
    (typeof value === "object" && value !== null && "html" in value)
      ? (value as RichText | string)
      : undefined;

  return (
    <MaybeRTF
      data={data}
      richTextStyleOverrides={richTextStyleOverrides}
    />
  );
};

export const isRichTextEmpty = (value: unknown): boolean => {
  if (!value) {
    return true;
  }

  if (typeof value === "string") {
    return value.trim() === "";
  }

  if (typeof value === "object" && "html" in value) {
    const html = (value as { html?: unknown }).html;
    return typeof html !== "string" || html.trim() === "";
  }

  return false;
};
