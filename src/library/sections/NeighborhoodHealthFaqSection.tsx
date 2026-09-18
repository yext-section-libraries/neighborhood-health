import type { SectionConfig } from "@yext/visual-editor";

import { useState } from "react";
import type { PuckComponent } from "@puckeditor/core";
import {
  msg,
  Background,
  createItemSource,
  EntityField,
  getDefaultForegroundColor,
  getAnalyticsScopeHash,
  getThemeColorCssValue,
  getSurfaceColorStyle,
  getDefaultRTF,
  resolveComponentData,
  toPuckFields,
  useDocument,
  type TranslatableRichText,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  VisibilityWrapper,
} from "@yext/visual-editor";
import { AnalyticsScopeProvider, useAnalytics } from "@yext/pages-components";
import {
  baseTypographyCss,
  getTextStyles,
  renderResolvedRichText,
  type SectionProps,
  type StyledTextProps,
  type StyledTextStyleProps,
} from "../shared/sectionHelpers";

type FaqItemFields = {
  answer: YextEntityField<TranslatableRichText>;
  question: YextEntityField<TranslatableString>;
};

type NeighborhoodHealthFaqSectionProps = {
  heading: StyledTextProps;
  itemStyles: {
    answer: StyledTextStyleProps;
    question: StyledTextStyleProps;
  };
  items: typeof faqItemSource.value;
  section: SectionProps;
};

const faqItemSource = createItemSource<FaqItemFields>({
  label: msg("fields.faqItems", "FAQ Items"),
  mappingFields: {
    question: {
      type: "entityField",
      label: msg("fields.question", "Question"),
      filter: { types: ["type.string"] },
    },
    answer: {
      type: "entityField",
      label: msg("fields.answer", "Answer"),
      filter: { types: ["type.rich_text_v2"] },
    },
  },
  defaultValues: [
    {
      question: {
        field: "",
        constantValue: {
          defaultValue:
            "When should I go to Urgent Care vs the ER in [[address.city]]?",
        },
        constantValueEnabled: true,
      },
      answer: {
        field: "",
        constantValue: {
          defaultValue: getDefaultRTF(
            "Urgent care is for conditions that need immediate attention but are not life-threatening, such as sprains, sore throats, or minor cuts. For chest pain, difficulty breathing, or severe trauma, please call 911 or go to the nearest ER.",
          ),
        },
        constantValueEnabled: true,
      },
    },
    {
      question: {
        field: "",
        constantValue: {
          defaultValue: "Do I need an appointment at [[name]]?",
        },
        constantValueEnabled: true,
      },
      answer: {
        field: "",
        constantValue: {
          defaultValue: getDefaultRTF(
            'No, walk-ins are always welcome. However, you can use our "Save My Spot" online check-in to reduce your wait time in the clinic.',
          ),
        },
        constantValueEnabled: true,
      },
    },
    {
      question: {
        field: "",
        constantValue: {
          defaultValue:
            "How long does it take to get lab results from [[name]]?",
        },
        constantValueEnabled: true,
      },
      answer: {
        field: "",
        constantValue: {
          defaultValue: getDefaultRTF(
            "Most routine blood work and rapid tests (Flu, Strep, COVID-19) are processed on-site. Results are typically uploaded to the Patient Portal within 4–24 hours.",
          ),
        },
        constantValueEnabled: true,
      },
    },
    {
      question: {
        field: "",
        constantValue: {
          defaultValue:
            "Is there a separate entrance for the [[name]] Urgent Care in [[address.city]]?",
        },
        constantValueEnabled: true,
      },
      answer: {
        field: "",
        constantValue: {
          defaultValue: getDefaultRTF(
            "This location offers support in English, Spanish, Chinese, and French.",
          ),
        },
        constantValueEnabled: true,
      },
    },
    {
      question: {
        field: "",
        constantValue: {
          defaultValue: "Can I pay my [[name]] bill online?",
        },
        constantValueEnabled: true,
      },
      answer: {
        field: "",
        constantValue: {
          defaultValue: getDefaultRTF(
            "Yes. Our secure bill-pay portal is available through the [[name]] website and the Patient Portal.",
          ),
        },
        constantValueEnabled: true,
      },
    },
  ],
});

const neighborhoodHealthFaqFields: YextFields<NeighborhoodHealthFaqSectionProps> =
  {
    section: {
      label: msg("fields.section", "Section"),
      type: "object",
      objectFields: {
        visibleOnLivePage: {
          label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
        backgroundColor: {
          label: msg("fields.backgroundColor", "Background Color"),
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
      },
    },
    heading: {
      label: msg("fields.heading", "Heading"),
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: msg("fields.text", "Text"),
          filter: {
            types: ["type.string"],
          },
        },
        styles: {
          label: msg("fields.textStyles", "Text Styles"),
          type: "styledText",
        },
        fontColor: {
          label: msg("fields.fontColor", "Font Color"),
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    items: faqItemSource.field,
    itemStyles: {
      label: msg("fields.faqItemStyles", "FAQ Item Styles"),
      type: "object",
      objectFields: {
        question: {
          label: msg("fields.question", "Question"),
          type: "object",
          objectFields: {
            styles: {
              label: msg("fields.textStyles", "Text Styles"),
              type: "styledText",
            },
            fontColor: {
              label: msg("fields.fontColor", "Font Color"),
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
        },
        answer: {
          label: msg("fields.answer", "Answer"),
          type: "object",
          objectFields: {
            styles: {
              label: msg("fields.textStyles", "Text Styles"),
              type: "styledText",
            },
            fontColor: {
              label: msg("fields.fontColor", "Font Color"),
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
        },
      },
    },
  };

/**
 * Renders the FAQ accordion with field-backed heading and rich-text answers.
 *
 * 1. Resolve heading and FAQ content from the current stream document.
 * 2. Apply the required section background-color contract to the shell.
 * 3. Preserve the semantic `<details>/<summary>` disclosure structure.
 */
const NeighborhoodHealthFaqSectionComponent: PuckComponent<
  NeighborhoodHealthFaqSectionProps
> = ({ heading, id, itemStyles, items, puck, section }) => {
  const analytics = useAnalytics();
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const [openIndex, setOpenIndex] = useState(0);
  const scopeName = `YextNeighborhoodHealthFaqSection${getAnalyticsScopeHash(id)}`;
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
  const resolvedItems = faqItemSource.resolveItems(items, streamDocument);
  const questionStyle = getTextStyles(
    itemStyles.question.styles,
    itemStyles.question.fontColor,
  );
  const answerRichTextStyleOverrides = {
    ...itemStyles.answer.styles,
    color:
      getThemeColorCssValue(itemStyles.answer.fontColor) ??
      getThemeColorCssValue(
        getDefaultForegroundColor(section.backgroundColor, streamDocument),
      ),
  };

  return (
    <VisibilityWrapper
      isEditing={puck.isEditing}
      liveVisibility={section.visibleOnLivePage}
    >
      <style>{`
${baseTypographyCss}
.yext-neighborhood-health-faq-question { font-family: var(--fontFamily-body-fontFamily); font-size: var(--fontSize-body-fontSize); line-height: 1.5; font-weight: var(--fontWeight-body-fontWeight); font-style: var(--fontStyle-body-fontStyle); text-transform: var(--textTransform-body-textTransform); }
      `}</style>
      <AnalyticsScopeProvider name={scopeName}>
        <Background background={section.backgroundColor}>
          <section
            className="px-6 py-16 md:px-8 lg:px-10"
            style={sectionSurfaceStyle}
          >
            <div className="mx-auto max-w-[920px]">
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
                displayName="FAQ Items"
                fieldId={items.field}
                constantValueEnabled={items.constantValueEnabled}
              >
                <div className="mt-10 border-b border-current/15">
                  {resolvedItems.map((item, index) => {
                    const isOpen = index === openIndex;
                    const resolvedQuestionValue = item.question
                      ? resolveComponentData(
                          item.question,
                          locale,
                          streamDocument,
                        )
                      : "";
                    const resolvedAnswerValue = item.answer
                      ? resolveComponentData(
                          item.answer,
                          locale,
                          streamDocument,
                        )
                      : undefined;
                    const resolvedQuestion =
                      typeof resolvedQuestionValue === "string"
                        ? resolvedQuestionValue
                        : "";

                    return (
                      <details
                        key={index}
                        className="border-t border-current/15"
                        open={isOpen}
                      >
                        <summary
                          className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-sm font-semibold md:text-base"
                          onClick={(event) => {
                            event.preventDefault();
                            setOpenIndex(isOpen ? -1 : index);
                            analytics?.track({
                              action: "CTA_CLICK",
                              eventName: `toggle${index}`,
                            });
                          }}
                        >
                          <span
                            className="yext-neighborhood-health-faq-question"
                            style={questionStyle}
                          >
                            {resolvedQuestion}
                          </span>
                          <span aria-hidden className="text-lg">
                            {isOpen ? "−" : "+"}
                          </span>
                        </summary>
                        {isOpen ? (
                          <div className="pb-4 text-sm leading-7 opacity-70 md:text-base">
                            {renderResolvedRichText(
                              resolvedAnswerValue,
                              answerRichTextStyleOverrides,
                            )}
                          </div>
                        ) : null}
                      </details>
                    );
                  })}
                </div>
              </EntityField>
            </div>
          </section>
        </Background>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const NeighborhoodHealthFaqSection: YextComponentConfig<NeighborhoodHealthFaqSectionProps> =
  {
    label: "FAQ Section",
    fields: toPuckFields<NeighborhoodHealthFaqSectionProps>(
      neighborhoodHealthFaqFields,
    ),
    defaultProps: {
      items: faqItemSource.defaultValue,
      heading: {
        text: {
          field: "",
          constantValue: {
            defaultValue: "Frequently asked questions",
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
          selectedColor: "white",
          contrastingColor: "black",
        },
      },
      itemStyles: {
        answer: {
          styles: {
            fontSize: "default",
            fontStyle: "default",
            fontFamily: "default",
            fontWeight: "default",
            textTransform: "default",
          },
        },
        question: {
          styles: {
            fontSize: "default",
            fontStyle: "default",
            fontFamily: "default",
            fontWeight: "default",
            textTransform: "default",
          },
        },
      },
    },
    render: (props) => <NeighborhoodHealthFaqSectionComponent {...props} />,
  };

export const config: SectionConfig = {
  id: "NeighborhoodHealthFaqSection",
  displayName: "FAQ Section",
  description: "FAQ Section",
  pageSetTypes: ["ENTITY"],
};
