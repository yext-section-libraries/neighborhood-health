import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import type { PuckComponent } from "@puckeditor/core";
import {
  Background,
  ComprehensiveCTA,
  createItemSource,
  EntityField,
  getDefaultForegroundColor,
  getAnalyticsScopeHash,
  getThemeColorCssValue,
  getSurfaceColorStyle,
  isDarkColor,
  getDefaultRTF,
  Image,
  MaybeRTF,
  resolveComponentData,
  toPuckFields,
  useDocument,
  type ComprehensiveCTAValue,
  type RichText,
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

type StyledTextStyleProps = {
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type SharedImageStyles = {
  aspectRatio: number;
  imageConstrain: "fixed" | "filled";
  styles?: StyledImageValue;
};

type ServiceCardFields = {
  description: YextEntityField<TranslatableRichText>;
  image: YextEntityField<ImageType | ComplexImageType | TranslatableAssetImage>;
  title: YextEntityField<TranslatableString>;
};

type NeighborhoodHealthFeaturedServicesSectionProps = {
  cardCtas: Array<{
    cta: ComprehensiveCTAValue;
  }>;
  cardStyles: {
    description: StyledTextStyleProps;
    image: SharedImageStyles;
    title: StyledTextStyleProps;
  };
  cards: typeof serviceCardsSource.value;
  heading: StyledTextProps;
  section: {
    visibleOnLivePage: boolean;
    backgroundColor: ThemeColor;
  };
  sectionCta: ComprehensiveCTAValue;
};

const createDefaultCardCta = (label: string): ComprehensiveCTAValue => ({
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
      fontSize: "default",
      fontStyle: "default",
      fontFamily: "default",
      fontWeight: "default",
      borderRadius: "default",
      letterSpacing: "default",
      textTransform: "default",
    },
    link: {
      fontSize: "default",
      fontStyle: "default",
      fontFamily: "default",
      fontWeight: "default",
      includeCaret: "none",
      letterSpacing: "default",
      textTransform: "default",
    },
  },
});

function getTextStyles(
  styles: StyledTextValue,
  fontColor?: ThemeColor,
): React.CSSProperties {
  return {
    color: getThemeColorCssValue(fontColor),
    fontFamily: styles.fontFamily === "default" ? undefined : styles.fontFamily,
    fontSize: styles.fontSize === "default" ? undefined : styles.fontSize,
    fontWeight: styles.fontWeight === "default" ? undefined : styles.fontWeight,
    fontStyle: styles.fontStyle === "default" ? undefined : styles.fontStyle,
    textTransform:
      styles.textTransform === "default" ? undefined : styles.textTransform,
  };
}

function renderResolvedRichText(
  value: unknown,
  richTextStyleOverrides: Omit<StyledTextValue, "color"> & { color?: string },
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

const serviceCardsSource = createItemSource<ServiceCardFields>({
  label: "Service Cards",
  mappingFields: {
    title: {
      type: "entityField",
      label: "Title",
      filter: { types: ["type.string"] },
    },
    description: {
      type: "entityField",
      label: "Description",
      filter: { types: ["type.rich_text_v2"] },
    },
    image: {
      type: "entityField",
      label: "Image",
      filter: { types: ["type.image"] },
    },
  },
  defaultValues: [
    {
      title: {
        field: "",
        constantValue: { defaultValue: "Urgent Care & Express Care" },
        constantValueEnabled: true,
      },
      description: {
        field: "",
        constantValue: {
          defaultValue: getDefaultRTF(
            "Immediate treatment for non-life-threatening illnesses and injuries including fractures, lacerations requiring stitches, infections, and respiratory issues. No appointment necessary.",
          ),
        },
        constantValueEnabled: true,
      },
      image: {
        field: "",
        constantValue: {
          url: "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg",
          width: 1267,
          height: 1900,
        },
        constantValueEnabled: true,
      },
    },
    {
      title: {
        field: "",
        constantValue: { defaultValue: "Primary & Family Medicine" },
        constantValueEnabled: true,
      },
      description: {
        field: "",
        constantValue: {
          defaultValue: getDefaultRTF(
            "Comprehensive longitudinal care for the whole family, from newborn pediatrics to geriatric medicine, focusing on wellness and chronic disease management.",
          ),
        },
        constantValueEnabled: true,
      },
      image: {
        field: "",
        constantValue: {
          url: "https://a.mktgcdn.com/p/fbSbItkZpsHpkc8qHH7GxvQkWzxsfm6mGc0k4Lmfl-A/1267x1900.jpg",
          width: 1267,
          height: 1900,
        },
        constantValueEnabled: true,
      },
    },
    {
      title: {
        field: "",
        constantValue: { defaultValue: "Occupational Health" },
        constantValueEnabled: true,
      },
      description: {
        field: "",
        constantValue: {
          defaultValue: getDefaultRTF(
            "Work-related injury care, DOT physicals, pre-employment screenings, and drug testing for local businesses.",
          ),
        },
        constantValueEnabled: true,
      },
      image: {
        field: "",
        constantValue: {
          url: "https://a.mktgcdn.com/p/Qdlacb36DqN5Lt3q6V9jw-qSMmbPyl_AeMEI_CyDkHc/1267x1900.jpg",
          width: 1267,
          height: 1900,
        },
        constantValueEnabled: true,
      },
    },
    {
      title: {
        field: "",
        constantValue: { defaultValue: "Laboratory & Imaging" },
        constantValueEnabled: true,
      },
      description: {
        field: "",
        constantValue: {
          defaultValue: getDefaultRTF(
            "Fast-turnaround diagnostic services. Most lab results are available within 24 hours via the Patient Portal.",
          ),
        },
        constantValueEnabled: true,
      },
      image: {
        field: "",
        constantValue: {
          url: "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg",
          width: 1267,
          height: 1900,
        },
        constantValueEnabled: true,
      },
    },
  ],
});

const neighborhoodHealthFeaturedServicesFields: YextFields<NeighborhoodHealthFeaturedServicesSectionProps> =
  {
    section: {
      label: "Section",
      type: "object",
      objectFields: {
        visibleOnLivePage: {
          label: "Visible on Live Page",
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
    cards: serviceCardsSource.field,
    cardCtas: {
      label: "Card Call to Actions",
      type: "array",
      arrayFields: {
        cta: {
          label: "Call to Action",
          type: "comprehensiveCTA",
        },
      },
      defaultItemProps: {
        cta: createDefaultCardCta("Card Call to Action"),
      },
      getItemSummary: (_item, index) =>
        `Card Call to Action ${(index ?? 0) + 1}`,
    },
    cardStyles: {
      label: "Card Styles",
      type: "object",
      objectFields: {
        title: {
          label: "Title Styles",
          type: "object",
          objectFields: {
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
        description: {
          label: "Description Styles",
          type: "object",
          objectFields: {
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
          label: "Image Styles",
          type: "object",
          objectFields: {
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
      },
    },
    sectionCta: {
      label: "Section CTA",
      type: "comprehensiveCTA",
    },
  };

/**
 * Renders the featured-services card grid with field-backed title, body,
 * image, CTA, and section background controls.
 *
 * 1. Resolve editor-backed content from the current stream document.
 * 2. Apply the required section background-color contract to the shell.
 * 3. Render card and section actions through `ComprehensiveCTA`.
 */
const NeighborhoodHealthFeaturedServicesSectionComponent: PuckComponent<
  NeighborhoodHealthFeaturedServicesSectionProps
> = ({
  cardCtas,
  cards,
  cardStyles,
  heading,
  id,
  puck,
  section,
  sectionCta,
}) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const scopeName = `YextNeighborhoodHealthFeaturedServicesSection${getAnalyticsScopeHash(
    id,
  )}`;
  const resolvedHeadingValue = resolveComponentData(
    heading.text,
    locale,
    streamDocument,
  );
  const resolvedHeading =
    typeof resolvedHeadingValue === "string" ? resolvedHeadingValue : "";
  const sectionSurfaceStyle = getSurfaceColorStyle(
    section.backgroundColor,
    streamDocument,
  );
  const hasDarkBackground = isDarkColor(
    section.backgroundColor,
    streamDocument,
  );
  const resolvedCards = serviceCardsSource.resolveItems(cards, streamDocument);
  const cardTitleStyle = getTextStyles(
    cardStyles.title.styles,
    cardStyles.title.fontColor,
  );
  const cardDescriptionStyleOverrides = {
    ...cardStyles.description.styles,
    color:
      getThemeColorCssValue(cardStyles.description.fontColor) ??
      getThemeColorCssValue(
        getDefaultForegroundColor(section.backgroundColor, streamDocument),
      ),
  };
  const imageWrapperStyle: React.CSSProperties = {
    aspectRatio:
      cardStyles.image.aspectRatio > 0
        ? cardStyles.image.aspectRatio
        : undefined,
    borderRadius:
      cardStyles.image.styles?.borderRadius === "default"
        ? undefined
        : cardStyles.image.styles?.borderRadius,
    overflow:
      cardStyles.image.imageConstrain === "filled" ||
      Boolean(
        cardStyles.image.styles?.borderRadius &&
        cardStyles.image.styles.borderRadius !== "default",
      )
        ? "hidden"
        : undefined,
  };
  const imageStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    height: cardStyles.image.aspectRatio > 0 ? "100%" : "auto",
    objectFit:
      cardStyles.image.imageConstrain === "filled" ? "cover" : "contain",
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
            <div className="mx-auto max-w-[1600px]">
              <EntityField
                displayName="Heading"
                fieldId={heading.text.field}
                constantValueEnabled={heading.text.constantValueEnabled}
              >
                <h2
                  className="text-center font-serif text-4xl tracking-[-0.04em] md:text-5xl"
                  style={getTextStyles(heading.styles, heading.fontColor)}
                >
                  {resolvedHeading}
                </h2>
              </EntityField>
              <EntityField
                displayName="Service Cards"
                fieldId={cards.field}
                constantValueEnabled={cards.constantValueEnabled}
              >
                <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                  {resolvedCards.map((card, index) => {
                    const resolvedTitleValue = card.title
                      ? resolveComponentData(card.title, locale, streamDocument)
                      : "";
                    const resolvedTitle =
                      typeof resolvedTitleValue === "string"
                        ? resolvedTitleValue
                        : "";
                    const resolvedDescriptionValue = card.description
                      ? resolveComponentData(
                          card.description,
                          locale,
                          streamDocument,
                          {
                            richTextStyleOverrides:
                              cardDescriptionStyleOverrides,
                          },
                        )
                      : undefined;
                    const resolvedImage = card.image
                      ? resolveComponentData(card.image, locale, streamDocument)
                      : undefined;
                    return (
                      <article key={index} className="flex flex-col">
                        <div className="overflow-hidden">
                          {resolvedImage ? (
                            <div style={imageWrapperStyle}>
                              <Image
                                className="h-full"
                                image={resolvedImage}
                                style={imageStyle}
                              />
                            </div>
                          ) : null}
                        </div>
                        <h3
                          className="mt-4  leading-none tracking-[-0.04em]"
                          style={cardTitleStyle}
                        >
                          {resolvedTitle}
                        </h3>
                        <div className="mt-3 leading-7 opacity-70 ">
                          {renderResolvedRichText(
                            resolvedDescriptionValue,
                            cardDescriptionStyleOverrides,
                          )}
                        </div>
                        {cardCtas[index]?.cta ? (
                          <ComprehensiveCTA
                            className="mt-4 max-w-full w-fit whitespace-normal break-words border-b border-current/15 pb-1 no-underline transition hover:border-current hover:no-underline"
                            eventName={`card${index}`}
                            value={
                              cardCtas[index]
                                .cta as unknown as Partial<ComprehensiveCTAValue>
                            }
                          />
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              </EntityField>
              <div className="mt-10 flex justify-center">
                <EntityField
                  displayName="Section Call to Action"
                  fieldId={sectionCta.data.cta.field}
                  constantValueEnabled={
                    sectionCta.data.cta.constantValueEnabled
                  }
                >
                  <ComprehensiveCTA
                    className={
                      sectionCta.styles.variant === "link"
                        ? `max-w-full w-fit whitespace-normal break-words border-b pb-1 no-underline transition hover:no-underline ${
                            hasDarkBackground
                              ? "border-white/40 hover:border-white"
                              : "border-current/15 hover:border-current"
                          }`
                        : "max-w-full whitespace-normal break-words px-8 py-3 text-center transition hover:opacity-90"
                    }
                    eventName="primaryCta"
                    value={sectionCta as Partial<ComprehensiveCTAValue>}
                  />
                </EntityField>
              </div>
            </div>
          </section>
        </Background>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const NeighborhoodHealthFeaturedServicesSection: YextComponentConfig<NeighborhoodHealthFeaturedServicesSectionProps> =
  {
    label: "Featured Services Section",
    fields: toPuckFields(neighborhoodHealthFeaturedServicesFields),
    defaultProps: {
      cardCtas: [
        { cta: createDefaultCardCta("Check In Online") },
        { cta: createDefaultCardCta("Schedule New Patient Visit") },
        { cta: createDefaultCardCta("View Employer Resources") },
        { cta: createDefaultCardCta("View Preparation Guide") },
      ],
      cards: serviceCardsSource.defaultValue,
      heading: {
        text: {
          field: "",
          constantValue: {
            hasLocalizedValue: "true",
            defaultValue: "Medical Services",
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
        visibleOnLivePage: true,
        backgroundColor: {
          selectedColor: "palette-quaternary",
          contrastingColor: "palette-quaternary-contrast",
        },
      },
      cardStyles: {
        image: {
          styles: {
            borderRadius: "default",
          },
          aspectRatio: 0.67,
          imageConstrain: "filled",
        },
        title: {
          styles: {
            fontSize: "default",
            fontStyle: "default",
            fontFamily: "default",
            fontWeight: "default",
            textTransform: "default",
          },
        },
        description: {
          styles: {
            fontSize: "default",
            fontStyle: "default",
            fontFamily: "default",
            fontWeight: "default",
            textTransform: "default",
          },
        },
      },
      sectionCta: {
        data: {
          cta: {
            field: "",
            selectedType: "textAndLink",
            constantValue: {
              link: "#",
              label: {
                defaultValue: "Explore More Services",
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
    },
    render: (props) => (
      <NeighborhoodHealthFeaturedServicesSectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  id: "NeighborhoodHealthFeaturedServicesSection",
  displayName: "Featured Services Section",
  description: "Featured Services Section",
  pageSetTypes: ["ENTITY"],
};
