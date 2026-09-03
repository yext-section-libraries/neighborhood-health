import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import {
  Background,
  ComprehensiveCTA,
  EntityField,
  getAnalyticsScopeHash,
  getThemeColorCssValue,
  getSurfaceColorStyle,
  Image,
  isDarkColor,
  MaybeRTF,
  resolveComponentData,
  toPuckFields,
  useDocument,
  type ComprehensiveCTAValue,
  type RichText,
  type StreamDocument,
  type StyledImageValue,
  type StyledTextValue,
  ThemeOptions,
  type ThemeColor,
  type TranslatableAssetImage,
  type TranslatableRichText,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  VisibilityWrapper,
} from "@yext/visual-editor";
import {
  AnalyticsScopeProvider,
  type ComplexImageType,
  type ImageType,
} from "@yext/pages-components";

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type StyledRtfProps = {
  text: YextEntityField<TranslatableRichText>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type StyledImageProps = {
  image: YextEntityField<ImageType | ComplexImageType | TranslatableAssetImage>;
  aspectRatio: number;
  imageConstrain: "fixed" | "filled";
  styles?: StyledImageValue;
};

type NeighborhoodHealthAboutSectionProps = {
  body: StyledRtfProps;
  cta: ComprehensiveCTAValue;
  heading: StyledTextProps;
  image: StyledImageProps;
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
};

function getTextStyles(
  styles: StyledTextValue,
  fontColor: ThemeColor | undefined,
  surfaceColor: ThemeColor,
  streamDocument: StreamDocument,
): React.CSSProperties {
  return {
    color:
      getThemeColorCssValue(fontColor) ??
      (isDarkColor(surfaceColor, streamDocument) ? "#fff" : "#000"),
    fontFamily: styles.fontFamily === "default" ? undefined : styles.fontFamily,
    fontSize: styles.fontSize === "default" ? undefined : styles.fontSize,
    fontWeight: styles.fontWeight === "default" ? undefined : styles.fontWeight,
    fontStyle: styles.fontStyle === "default" ? undefined : styles.fontStyle,
    textTransform:
      styles.textTransform === "default" ? undefined : styles.textTransform,
  };
}

function getRichTextStyleOverrides(
  styles: StyledTextValue,
  fontColor: ThemeColor | undefined,
  surfaceColor: ThemeColor,
  streamDocument: StreamDocument,
): Omit<StyledTextValue, "color"> & { color: string } {
  return {
    ...styles,
    color:
      getThemeColorCssValue(fontColor) ??
      (isDarkColor(surfaceColor, streamDocument) ? "#fff" : "#000"),
  };
}

function renderResolvedRichText(
  value: unknown,
  richTextStyleOverrides: Omit<StyledTextValue, "color"> & { color: string },
): React.ReactNode {
  if (React.isValidElement(value)) {
    return value;
  }

  const normalizedValue: RichText | string | undefined =
    typeof value === "string"
      ? value
      : typeof value === "object" && value !== null && "html" in value
        ? (value as RichText)
        : undefined;

  return (
    <MaybeRTF
      data={normalizedValue}
      richTextStyleOverrides={richTextStyleOverrides}
    />
  );
}

const neighborhoodHealthAboutFields: YextFields<NeighborhoodHealthAboutSectionProps> =
  {
    section: {
      label: "Section",
      type: "object",
      objectFields: {
        visibleOnLivePage: {
          label: "Visible On Live Page",
          type: "radio",
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
        backgroundColor: {
          label: "Background Color",
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
      },
    },
    heading: {
      label: "Heading",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: {
            types: ["type.string"],
          },
        },
        styles: {
          label: "Text Styles",
          type: "styledText",
        },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    image: {
      label: "Image",
      type: "object",
      objectFields: {
        image: {
          type: "entityField",
          label: "Image",
          filter: {
            types: ["type.image"],
          },
        },
        aspectRatio: {
          label: "Aspect Ratio",
          type: "select",
          options: ThemeOptions.ASPECT_RATIO,
        },
        imageConstrain: {
          label: "Image Constrain",
          type: "select",
          options: [
            { label: "Fixed", value: "fixed" },
            { label: "Filled", value: "filled" },
          ],
        },
        styles: {
          label: "Image Styles",
          type: "styledImage",
        },
      },
    },
    body: {
      label: "Body",
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: "Text",
          filter: {
            types: ["type.rich_text_v2"],
          },
        },
        styles: {
          label: "Text Styles",
          type: "styledText",
        },
        fontColor: {
          label: "Font Color",
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    cta: {
      label: "CTA",
      type: "comprehensiveCTA",
    },
  };

/**
 * Renders the about split band with field-backed heading, body,
 * image, CTA, and section background controls.
 *
 * 1. Resolve editor-backed content from the current stream document.
 * 2. Apply the required section background-color contract to the visible shell.
 * 3. Render the body as rich text and the button through `ComprehensiveCTA`.
 */
const NeighborhoodHealthAboutSectionComponent: PuckComponent<
  NeighborhoodHealthAboutSectionProps
> = ({ body, cta, heading, id, image, puck, section }) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const scopeName = `YextNeighborhoodHealthAboutSection${getAnalyticsScopeHash(id)}`;
  const resolvedHeadingValue = resolveComponentData(
    heading.text,
    locale,
    streamDocument,
  );
  const resolvedHeading =
    typeof resolvedHeadingValue === "string" ? resolvedHeadingValue : "";
  const resolvedImage = resolveComponentData(
    image.image,
    locale,
    streamDocument,
  );
  const bodyRichTextStyleOverrides = getRichTextStyleOverrides(
    body.styles,
    body.fontColor,
    section.backgroundColor,
    streamDocument,
  );
  const resolvedBody = resolveComponentData(body.text, locale, streamDocument, {
    richTextStyleOverrides: bodyRichTextStyleOverrides,
  });
  const sectionSurfaceStyle = getSurfaceColorStyle(
    section.backgroundColor,
    streamDocument,
  );
  const hasDarkBackground = isDarkColor(
    section.backgroundColor,
    streamDocument,
  );
  const imageWrapperStyle = {
    aspectRatio: image.aspectRatio > 0 ? image.aspectRatio : undefined,
    borderRadius:
      image.styles?.borderRadius === "default"
        ? undefined
        : image.styles?.borderRadius,
    overflow:
      image.imageConstrain === "filled" ||
      Boolean(
        image.styles?.borderRadius && image.styles.borderRadius !== "default",
      )
        ? "hidden"
        : undefined,
  };
  const imageStyle = {
    display: "block",
    width: "100%",
    height: image.aspectRatio > 0 ? "100%" : "auto",
    objectFit:
      image.imageConstrain === "filled"
        ? ("cover" as const)
        : ("contain" as const),
  };

  return (
    <VisibilityWrapper
      isEditing={puck.isEditing}
      liveVisibility={section.visibleOnLivePage}
    >
      <style>{`
p { font-family: var(--fontFamily-body-fontFamily); font-size: var(--fontSize-body-fontSize); line-height: 1.5; font-weight: var(--fontWeight-body-fontWeight); font-style: var(--fontStyle-body-fontStyle); text-transform: var(--textTransform-body-textTransform); }
li { font-family: var(--fontFamily-body-fontFamily); font-size: var(--fontSize-body-fontSize); line-height: 1.5; font-weight: var(--fontWeight-body-fontWeight); font-style: var(--fontStyle-body-fontStyle); text-transform: var(--textTransform-body-textTransform); }
h1, h1[class] { font-family: var(--fontFamily-h1-fontFamily); font-size: var(--fontSize-h1-fontSize); line-height: 1.2; font-weight: var(--fontWeight-h1-fontWeight); font-style: var(--fontStyle-h1-fontStyle); text-transform: var(--textTransform-h1-textTransform); }
h2, h2[class] { font-family: var(--fontFamily-h2-fontFamily); font-size: var(--fontSize-h2-fontSize); line-height: 1.2; font-weight: var(--fontWeight-h2-fontWeight); font-style: var(--fontStyle-h2-fontStyle); text-transform: var(--textTransform-h2-textTransform); }
h3, h3[class] { font-family: var(--fontFamily-h3-fontFamily); font-size: var(--fontSize-h3-fontSize); line-height: 1.2; font-weight: var(--fontWeight-h3-fontWeight); font-style: var(--fontStyle-h3-fontStyle); text-transform: var(--textTransform-h3-textTransform); }
h4, h4[class] { font-family: var(--fontFamily-h4-fontFamily); font-size: var(--fontSize-h4-fontSize); line-height: 1.2; font-weight: var(--fontWeight-h4-fontWeight); font-style: var(--fontStyle-h4-fontStyle); text-transform: var(--textTransform-h4-textTransform); }
h5, h5[class] { font-family: var(--fontFamily-h5-fontFamily); font-size: var(--fontSize-h5-fontSize); line-height: 1.2; font-weight: var(--fontWeight-h5-fontWeight); font-style: var(--fontStyle-h5-fontStyle); text-transform: var(--textTransform-h5-textTransform); }
h6, h6[class] { font-family: var(--fontFamily-h6-fontFamily); font-size: var(--fontSize-h6-fontSize); line-height: 1.2; font-weight: var(--fontWeight-h6-fontWeight); font-style: var(--fontStyle-h6-fontStyle); text-transform: var(--textTransform-h6-textTransform); }
.yext-neighborhood-health-about-body p + p { margin-top: 1rem; }

      `}</style>
      <AnalyticsScopeProvider name={scopeName}>
        <Background background={section.backgroundColor}>
          <section
            className="px-6 py-16 md:px-8 lg:px-10"
            style={sectionSurfaceStyle}
          >
            <div className="mx-auto grid max-w-[1600px] items-center gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
              <div className="order-1 rounded-lg bg-white/8 p-4 md:p-6">
                {resolvedImage ? (
                  <EntityField
                    displayName="Image"
                    fieldId={image.image.field}
                    constantValueEnabled={image.image.constantValueEnabled}
                  >
                    <div style={imageWrapperStyle}>
                      <Image
                        className="h-full"
                        image={resolvedImage}
                        style={imageStyle}
                      />
                    </div>
                  </EntityField>
                ) : null}
              </div>
              <div className="order-2 text-center">
                <EntityField
                  displayName="Heading"
                  fieldId={heading.text.field}
                  constantValueEnabled={heading.text.constantValueEnabled}
                >
                  <h2
                    className="font-serif text-4xl tracking-[-0.04em] md:text-5xl"
                    style={getTextStyles(
                      heading.styles,
                      heading.fontColor,
                      section.backgroundColor,
                      streamDocument,
                    )}
                  >
                    {resolvedHeading}
                  </h2>
                </EntityField>
                <EntityField
                  displayName="Body"
                  fieldId={body.text.field}
                  constantValueEnabled={body.text.constantValueEnabled}
                >
                  <div className="yext-neighborhood-health-about-body mx-auto mt-5 max-w-[52ch] text-sm leading-7 md:text-base">
                    {renderResolvedRichText(
                      resolvedBody,
                      bodyRichTextStyleOverrides,
                    )}
                  </div>
                </EntityField>
                <div aria-hidden="true" className="mt-5 text-xl leading-none">
                  ✦
                </div>
                <div className="mt-8 flex justify-center">
                  <EntityField
                    displayName="Call to Action"
                    fieldId={cta.data.cta.field}
                    constantValueEnabled={cta.data.cta.constantValueEnabled}
                  >
                    <ComprehensiveCTA
                      className={
                        cta.styles.variant === "link"
                          ? `max-w-full w-fit whitespace-normal break-words border-b pb-1 no-underline transition hover:no-underline ${
                              hasDarkBackground
                                ? "border-white/40 hover:border-white"
                                : "border-current/15 hover:border-current"
                            }`
                          : "max-w-full whitespace-normal break-words px-8 py-3 text-center transition hover:opacity-90"
                      }
                      eventName="primaryCta"
                      value={cta as Partial<ComprehensiveCTAValue>}
                    />
                  </EntityField>
                </div>
              </div>
            </div>
          </section>
        </Background>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const NeighborhoodHealthAboutSection: YextComponentConfig<NeighborhoodHealthAboutSectionProps> =
  {
    label: "About Section",
    fields: toPuckFields(neighborhoodHealthAboutFields),
    defaultProps: {
      cta: {
        data: {
          cta: {
            field: "",
            selectedType: "textAndLink",
            constantValue: {
              link: "#",
              label: {
                defaultValue: "Book New Patient Visit",
                hasLocalizedValue: "true",
              },
              ctaType: "textAndLink",
              linkType: "URL",
              openInNewTab: false,
              normalizeLink: false,
            },
            constantValueEnabled: true,
          },
          customId: "",
          ariaLabel: {
            defaultValue: "Button",
          },
          actionType: "link",
          buttonText: {
            defaultValue: "Button",
          },
          customClass: "",
          openInNewTab: false,
          dataAttributes: [],
        },
        styles: {
          link: {
            fontSize: "default",
            fontStyle: "default",
            fontFamily: "default",
            fontWeight: "default",
            includeCaret: "default",
            letterSpacing: "default",
            textTransform: "default",
          },
          color: {
            selectedColor: "palette-tertiary",
            contrastingColor: "palette-tertiary-contrast",
          },
          button: {
            fontSize: "default",
            fontStyle: "default",
            fontFamily: "default",
            fontWeight: "default",
            borderRadius: "lg",
            letterSpacing: "default",
            textTransform: "default",
          },
          variant: "primary",
          presetImage: "app-store",
        },
      },
      body: {
        text: {
          field: "",
          constantValue: {
            hasLocalizedValue: "true",
            defaultValue: {
              html: '<p dir="ltr" style="font-size: 14.67px; font-weight: 400; line-height: 18.67px; color: rgb(0, 0, 0); margin: 0; padding: 3px 2px 3px 2px; position: relative;"><span>[[name]] - [[geomodifier]] is [[address.city]]&#39;s premier destination for integrated medical services. Located conveniently at [[address.line1]], we bridge the gap between a standard doctor&#39;s office and a hospital emergency room. </span><br/><br/><span>Our facility is designed for efficiency and patient comfort. By housing advanced imaging, a high-complexity lab, and a diverse team of specialists under one roof, we ensure that diagnosis and treatment happen in hours, not days. We are committed to reducing ER wait times and providing the Denver community with a higher standard of local healthcare.</span></p>',
              json: '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"[[name]] - [[geomodifier]] is [[address.city]]\'s premier destination for integrated medical services. Located conveniently at [[address.line1]], we bridge the gap between a standard doctor\'s office and a hospital emergency room. ","type":"text","version":1},{"type":"linebreak","version":1},{"type":"linebreak","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":"Our facility is designed for efficiency and patient comfort. By housing advanced imaging, a high-complexity lab, and a diverse team of specialists under one roof, we ensure that diagnosis and treatment happen in hours, not days. We are committed to reducing ER wait times and providing the Denver community with a higher standard of local healthcare.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
            },
          },
          constantValueEnabled: true,
        },
        styles: {
          fontSize: "default",
          fontStyle: "default",
          fontFamily: "default",
          fontWeight: "default",
          textTransform: "default",
        },
      },
      image: {
        image: {
          field: "",
          constantValue: {
            url: "https://a.mktgcdn.com/p/fbSbItkZpsHpkc8qHH7GxvQkWzxsfm6mGc0k4Lmfl-A/1267x1900.jpg",
            width: 1267,
            height: 1900,
          },
          constantValueEnabled: true,
        },
        styles: {
          borderRadius: "default",
        },
        aspectRatio: 0.67,
        imageConstrain: "filled",
      },
      heading: {
        text: {
          field: "",
          constantValue: {
            hasLocalizedValue: "true",
            defaultValue: "About this Location",
          },
          constantValueEnabled: true,
        },
        styles: {
          fontSize: "default",
          fontStyle: "default",
          fontFamily: "default",
          fontWeight: "default",
          textTransform: "default",
        },
      },
      section: {
        backgroundColor: {
          selectedColor: "palette-primary",
          contrastingColor: "palette-primary-contrast",
        },
        visibleOnLivePage: true,
      },
    },
    render: (props) => (
      <NeighborhoodHealthAboutSectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  id: "NeighborhoodHealthAboutSection",
  displayName: "About Section",
  description: "About Section",
  pageSetTypes: ["ENTITY"],
};
