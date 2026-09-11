import type { SectionConfig } from "@yext/visual-editor";

import type { PuckComponent } from "@puckeditor/core";
import {
  Background,
  ComprehensiveCTA,
  EntityField,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  isDarkColor,
  Image,
  resolveComponentData,
  toPuckFields,
  useDocument,
  type ComprehensiveCTAValue,
  type YextComponentConfig,
  type YextFields,
  VisibilityWrapper,
} from "@yext/visual-editor";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import {
  aspectRatioOptions,
  baseTypographyCss,
  getRichTextStyleOverrides,
  getTextStyles,
  renderResolvedRichText,
  type SectionProps,
  type StyledImageProps,
  type StyledRtfProps,
  type StyledTextProps,
} from "../shared/sectionHelpers";

type NeighborhoodHealthResourcesSectionProps = {
  body: StyledRtfProps;
  cta: ComprehensiveCTAValue;
  heading: StyledTextProps;
  image: StyledImageProps;
  section: SectionProps;
};

const neighborhoodHealthResourcesFields: YextFields<NeighborhoodHealthResourcesSectionProps> =
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
          options: aspectRatioOptions,
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
    cta: {
      label: "CTA",
      type: "comprehensiveCTA",
    },
  };

/**
 * Renders the resources promo band with field-backed heading, body, image,
 * CTA, and section background controls.
 *
 * 1. Resolve editor-backed content from the current stream document.
 * 2. Apply the required section background-color contract to the visible shell.
 * 3. Render the button through `ComprehensiveCTA`.
 */
const NeighborhoodHealthResourcesSectionComponent: PuckComponent<
  NeighborhoodHealthResourcesSectionProps
> = ({ body, cta, heading, id, image, puck, section }) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const scopeName = `YextNeighborhoodHealthResourcesSection${getAnalyticsScopeHash(id)}`;
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
${baseTypographyCss}

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
                    style={getTextStyles(heading.styles, heading.fontColor)}
                  >
                    {resolvedHeading}
                  </h2>
                </EntityField>
                <EntityField
                  displayName="Body"
                  fieldId={body.text.field}
                  constantValueEnabled={body.text.constantValueEnabled}
                >
                  <div className="mx-auto mt-5 max-w-[46ch] text-sm leading-7 opacity-75 md:text-base">
                    {renderResolvedRichText(
                      resolvedBodyValue,
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
                          : "max-w-full whitespace-normal break-words rounded-full px-8 py-3 text-center transition hover:opacity-90"
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

export const NeighborhoodHealthResourcesSection: YextComponentConfig<NeighborhoodHealthResourcesSectionProps> =
  {
    label: "Resources Section",
    fields: toPuckFields<NeighborhoodHealthResourcesSectionProps>(
      neighborhoodHealthResourcesFields,
    ),
    defaultProps: {
      cta: {
        data: {
          actionType: "link",
          cta: {
            field: "",
            selectedType: "textAndLink",
            constantValue: {
              link: "#",
              label: {
                defaultValue: "View Community Calendar",
                hasLocalizedValue: "true",
              },
              ctaType: "textAndLink",
              linkType: "URL",
              openInNewTab: false,
              normalizeLink: false,
            },
            constantValueEnabled: true,
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
          variant: "primary",
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
          color: {
            selectedColor: "palette-tertiary",
            contrastingColor: "palette-tertiary-contrast",
          },
        },
      },
      body: {
        text: {
          field: "",
          constantValue: {
            hasLocalizedValue: "true",
            defaultValue: {
              json: '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"[[name]] is more than a clinic; we are a community partner. We provide medical support for [[address.city]] high school athletics and host monthly \\"Walk with a Doc\\" sessions at local parks to encourage heart health.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
              html: '<p dir="ltr" style="font-size: 14.67px; font-weight: 400; line-height: 18.67px; color: rgb(0, 0, 0); margin: 0; padding: 3px 2px 3px 2px; position: relative;"><span>[[name]] is more than a clinic; we are a community partner. We provide medical support for [[address.city]] high school athletics and host monthly &#34;Walk with a Doc&#34; sessions at local parks to encourage heart health.</span></p>',
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
            url: "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg",
            width: 1267,
            height: 1900,
          },
          constantValueEnabled: true,
        },
        styles: {
          borderRadius: "default",
        },
        aspectRatio: 1,
        imageConstrain: "filled",
      },
      heading: {
        text: {
          field: "",
          constantValue: {
            hasLocalizedValue: "true",
            defaultValue: "Community Outreach",
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
      <NeighborhoodHealthResourcesSectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  id: "NeighborhoodHealthResourcesSection",
  displayName: "Resources Section",
  description: "Resources Section",
  pageSetTypes: ["ENTITY"],
};
