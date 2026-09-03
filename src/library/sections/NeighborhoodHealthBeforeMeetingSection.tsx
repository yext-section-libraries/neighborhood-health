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
  TranslatableCTA,
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

type LinkItem = {
  cta: ComprehensiveCTAValue;
};

type NeighborhoodHealthBeforeMeetingSectionProps = {
  body: StyledRtfProps;
  heading: StyledTextProps;
  image: StyledImageProps;
  links: LinkItem[];
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

function createDefaultStyledTextValue(): StyledTextValue {
  return {
    fontFamily: "default",
    fontSize: "default",
    fontWeight: "default",
    fontStyle: "default",
    textTransform: "default",
  };
}

function createDefaultComprehensiveCTA(
  label: string,
  link: string,
): ComprehensiveCTAValue {
  return {
    data: {
      actionType: "link",
      cta: {
        field: "",
        constantValue: {
          label,
          link,
          linkType: "URL",
          ctaType: "textAndLink",
          openInNewTab: false,
          normalizeLink: false,
        },
        constantValueEnabled: true,
        selectedType: "textAndLink",
      },
      openInNewTab: false,
    },
    styles: {
      variant: "link",
      color: undefined,
      button: {
        ...createDefaultStyledTextValue(),
        borderRadius: "lg",
        letterSpacing: "default",
      },
      link: {
        ...createDefaultStyledTextValue(),
        includeCaret: "default",
        letterSpacing: "default",
      },
    },
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

const neighborhoodHealthBeforeMeetingFields: YextFields<NeighborhoodHealthBeforeMeetingSectionProps> =
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
    links: {
      label: "Links",
      type: "array",
      defaultItemProps: {
        cta: createDefaultComprehensiveCTA("Link", "#"),
      },
      getItemSummary: (item, i) => {
        const streamDocument = useDocument();
        const label = resolveComponentData<TranslatableCTA>(
          item.cta.data.cta,
          streamDocument?.locale ?? "en",
          streamDocument,
        )?.label as string;
        return label ?? "Link " + ((i ?? 0) + 1);
      },
      arrayFields: {
        cta: {
          label: "Call to Action",
          type: "comprehensiveCTA",
        },
      },
    },
  };

/**
 * Renders the pre-meeting promo band with field-backed heading, body, image,
 * CTA-link list, and section background controls.
 *
 * 1. Resolve editor-backed content from the current stream document.
 * 2. Apply the required section background-color contract to the visible shell.
 * 3. Render the visible resource links through `ComprehensiveCTA`.
 */
const NeighborhoodHealthBeforeMeetingSectionComponent: PuckComponent<
  NeighborhoodHealthBeforeMeetingSectionProps
> = ({ body, heading, id, image, links, puck, section }) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const scopeName = `YextNeighborhoodHealthBeforeMeetingSection${getAnalyticsScopeHash(
    id,
  )}`;
  const resolvedHeadingValue = resolveComponentData(
    heading.text,
    locale,
    streamDocument,
  );
  const bodyRichTextStyleOverrides = getRichTextStyleOverrides(
    body.styles,
    body.fontColor,
    section.backgroundColor,
    streamDocument,
  );
  const resolvedBodyValue = resolveComponentData(
    body.text,
    locale,
    streamDocument,
    { richTextStyleOverrides: bodyRichTextStyleOverrides },
  );
  const resolvedHeading =
    typeof resolvedHeadingValue === "string" ? resolvedHeadingValue : "";
  const resolvedImage = resolveComponentData(
    image.image,
    locale,
    streamDocument,
  );
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

      `}</style>
      <AnalyticsScopeProvider name={scopeName}>
        <Background background={section.backgroundColor}>
          <section
            className="px-6 py-16 md:px-8 lg:px-10"
            style={sectionSurfaceStyle}
          >
            <div className="mx-auto grid max-w-[1600px] items-center gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
              <div className="order-1 rounded-lg p-4 md:order-2 md:p-6">
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
              <div className="order-2 text-center md:order-1">
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
                  <div className="mx-auto mt-5 max-w-[46ch] text-sm leading-7 md:text-base">
                    {renderResolvedRichText(
                      resolvedBodyValue,
                      bodyRichTextStyleOverrides,
                    )}
                  </div>
                </EntityField>
                <div aria-hidden="true" className="mt-5 text-xl leading-none">
                  ✦
                </div>
                <div className="mt-8 flex flex-col items-center gap-3 text-sm">
                  {links.map((link, index) => (
                    <EntityField
                      key={index}
                      displayName={`Link ${index + 1}`}
                      fieldId={link.cta.data.cta.field}
                      constantValueEnabled={
                        link.cta.data.cta.constantValueEnabled
                      }
                    >
                      <ComprehensiveCTA
                        className={
                          link.cta.styles.variant === "link"
                            ? `max-w-full w-fit whitespace-normal break-words border-b pb-1 no-underline transition hover:no-underline ${
                                hasDarkBackground
                                  ? "border-white/40 hover:border-white"
                                  : "border-current/15 hover:border-current"
                              }`
                            : "max-w-full whitespace-normal break-words text-center"
                        }
                        eventName={`link${index}`}
                        value={link.cta as Partial<ComprehensiveCTAValue>}
                      />
                    </EntityField>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </Background>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const NeighborhoodHealthBeforeMeetingSection: YextComponentConfig<NeighborhoodHealthBeforeMeetingSectionProps> =
  {
    label: "Before Meeting Section",
    fields: toPuckFields(neighborhoodHealthBeforeMeetingFields),
    defaultProps: {
      body: {
        text: {
          field: "",
          constantValue: {
            hasLocalizedValue: "true",
            defaultValue: {
              json: '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Review these resources before your appointment to streamline your visit.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
              html: '<p dir="ltr" style="font-size: 14.67px; font-weight: 400; line-height: 18.67px; color: rgb(0, 0, 0); margin: 0; padding: 3px 2px 3px 2px; position: relative;"><span>Review these resources before your appointment to streamline your visit.</span></p>',
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
            url: "https://a.mktgcdn.com/p/Qdlacb36DqN5Lt3q6V9jw-qSMmbPyl_AeMEI_CyDkHc/1267x1900.jpg",
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
      links: [
        {
          cta: {
            data: {
              actionType: "link",
              cta: {
                field: "",
                constantValue: {
                  label: {
                    defaultValue: "Online Registration Forms",
                    hasLocalizedValue: "true",
                  },
                  link: "#",
                  linkType: "URL",
                  ctaType: "textAndLink",
                  openInNewTab: false,
                  normalizeLink: false,
                },
                constantValueEnabled: true,
                selectedType: "textAndLink",
              },
              openInNewTab: false,
              buttonText: {
                defaultValue: "Button",
              },
              customId: "",
              customClass: "",
              dataAttributes: [],
              ariaLabel: {
                defaultValue: "Button",
              },
            },
            styles: {
              variant: "link",
              presetImage: "app-store",
              button: {
                fontFamily: "default",
                fontSize: "default",
                fontWeight: "default",
                fontStyle: "default",
                textTransform: "default",
                borderRadius: "lg",
                letterSpacing: "default",
              },
              link: {
                fontFamily: "default",
                fontSize: "default",
                fontWeight: "default",
                fontStyle: "default",
                textTransform: "default",
                letterSpacing: "default",
                includeCaret: "default",
              },
            },
          },
        },
        {
          cta: {
            data: {
              actionType: "link",
              cta: {
                field: "",
                constantValue: {
                  label: {
                    defaultValue: "Comprehensive Insurance List",
                    hasLocalizedValue: "true",
                  },
                  link: "#",
                  linkType: "URL",
                  ctaType: "textAndLink",
                  openInNewTab: false,
                  normalizeLink: false,
                },
                constantValueEnabled: true,
                selectedType: "textAndLink",
              },
              openInNewTab: false,
              buttonText: {
                defaultValue: "Button",
              },
              customId: "",
              customClass: "",
              dataAttributes: [],
              ariaLabel: {
                defaultValue: "Button",
              },
            },
            styles: {
              variant: "link",
              presetImage: "app-store",
              button: {
                fontFamily: "default",
                fontSize: "default",
                fontWeight: "default",
                fontStyle: "default",
                textTransform: "default",
                borderRadius: "lg",
                letterSpacing: "default",
              },
              link: {
                fontFamily: "default",
                fontSize: "default",
                fontWeight: "default",
                fontStyle: "default",
                textTransform: "default",
                letterSpacing: "default",
                includeCaret: "default",
              },
            },
          },
        },
        {
          cta: {
            data: {
              actionType: "link",
              cta: {
                field: "",
                constantValue: {
                  label: {
                    defaultValue: "Financial Policies",
                    hasLocalizedValue: "true",
                  },
                  link: "#",
                  linkType: "URL",
                  ctaType: "textAndLink",
                  openInNewTab: false,
                  normalizeLink: false,
                },
                constantValueEnabled: true,
                selectedType: "textAndLink",
              },
              openInNewTab: false,
              buttonText: {
                defaultValue: "Button",
              },
              customId: "",
              customClass: "",
              dataAttributes: [],
              ariaLabel: {
                defaultValue: "Button",
              },
            },
            styles: {
              variant: "link",
              presetImage: "app-store",
              button: {
                fontFamily: "default",
                fontSize: "default",
                fontWeight: "default",
                fontStyle: "default",
                textTransform: "default",
                borderRadius: "lg",
                letterSpacing: "default",
              },
              link: {
                fontFamily: "default",
                fontSize: "default",
                fontWeight: "default",
                fontStyle: "default",
                textTransform: "default",
                letterSpacing: "default",
                includeCaret: "default",
              },
            },
          },
        },
        {
          cta: {
            data: {
              actionType: "link",
              cta: {
                field: "",
                constantValue: {
                  label: {
                    defaultValue: "Telehealth Sign-In",
                    hasLocalizedValue: "true",
                  },
                  link: "#",
                  linkType: "URL",
                  ctaType: "textAndLink",
                  openInNewTab: false,
                  normalizeLink: false,
                },
                constantValueEnabled: true,
                selectedType: "textAndLink",
              },
              openInNewTab: false,
              buttonText: {
                defaultValue: "Button",
              },
              customId: "",
              customClass: "",
              dataAttributes: [],
              ariaLabel: {
                defaultValue: "Button",
              },
            },
            styles: {
              variant: "link",
              presetImage: "app-store",
              button: {
                fontFamily: "default",
                fontSize: "default",
                fontWeight: "default",
                fontStyle: "default",
                textTransform: "default",
                borderRadius: "lg",
                letterSpacing: "default",
              },
              link: {
                fontFamily: "default",
                fontSize: "default",
                fontWeight: "default",
                fontStyle: "default",
                textTransform: "default",
                letterSpacing: "default",
                includeCaret: "default",
              },
            },
          },
        },
      ],
      heading: {
        text: {
          field: "",
          constantValue: {
            hasLocalizedValue: "true",
            defaultValue: "Patient Resources",
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
      <NeighborhoodHealthBeforeMeetingSectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  id: "NeighborhoodHealthBeforeMeetingSection",
  displayName: "Before Meeting Section",
  description: "Before Meeting Section",
  pageSetTypes: ["ENTITY"],
};
