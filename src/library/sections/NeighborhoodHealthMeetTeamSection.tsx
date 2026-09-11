import type { SectionConfig } from "@yext/visual-editor";

import type { PuckComponent } from "@puckeditor/core";
import {
  Background,
  ComprehensiveCTA,
  createItemSource,
  EntityField,
  getDefaultRTF,
  getDefaultForegroundColor,
  getAnalyticsScopeHash,
  getThemeColorCssValue,
  getSurfaceColorStyle,
  Image,
  resolveComponentData,
  toPuckFields,
  useDocument,
  type ComprehensiveCTAValue,
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
import {
  baseTypographyCss,
  createDefaultCardCta,
  getTextStyles,
  renderResolvedRichText,
  type StyledTextProps,
  type StyledTextStyleProps,
} from "../shared/sectionHelpers";

type TeamMemberFields = {
  credentials: YextEntityField<TranslatableRichText>;
  image: YextEntityField<ImageType | ComplexImageType | TranslatableAssetImage>;
  licenses: YextEntityField<TranslatableRichText>;
  name: YextEntityField<TranslatableString>;
  role: YextEntityField<TranslatableString>;
  specialties: YextEntityField<TranslatableRichText>;
};

type NeighborhoodHealthMeetTeamSectionProps = {
  memberCtas: Array<{
    cta: ComprehensiveCTAValue;
  }>;
  cardStyles: {
    labels: StyledTextStyleProps;
    name: StyledTextStyleProps;
    position: StyledTextStyleProps;
    values: StyledTextStyleProps;
  };
  heading: StyledTextProps;
  labels: {
    credentials: YextEntityField<TranslatableString>;
    licenses: YextEntityField<TranslatableString>;
    specialties: YextEntityField<TranslatableString>;
  };
  members: typeof teamMembersSource.value;
  section: {
    visibleOnLivePage: boolean;
    backgroundColor: ThemeColor;
    cardBackgroundColor: ThemeColor;
  };
};

const teamMembersSource = createItemSource<TeamMemberFields>({
  label: "Team Members",
  mappingFields: {
    name: {
      type: "entityField",
      label: "Name",
      filter: { types: ["type.string"] },
    },
    role: {
      type: "entityField",
      label: "Position",
      filter: { types: ["type.string"] },
    },
    credentials: {
      type: "entityField",
      label: "Credentials",
      filter: { types: ["type.rich_text_v2"] },
    },
    licenses: {
      type: "entityField",
      label: "Licenses",
      filter: { types: ["type.rich_text_v2"] },
    },
    specialties: {
      type: "entityField",
      label: "Specialties",
      filter: { types: ["type.rich_text_v2"] },
    },
    image: {
      type: "entityField",
      label: "Image",
      filter: { types: ["type.image"] },
    },
  },
  defaultValues: Array.from({ length: 4 }, () => ({
    name: {
      field: "",
      constantValue: { defaultValue: "Name" },
      constantValueEnabled: true,
    },
    role: {
      field: "",
      constantValue: { defaultValue: "Role" },
      constantValueEnabled: true,
    },
    credentials: {
      field: "",
      constantValue: { defaultValue: getDefaultRTF("Credentials") },
      constantValueEnabled: true,
    },
    licenses: {
      field: "",
      constantValue: { defaultValue: getDefaultRTF("Licenses") },
      constantValueEnabled: true,
    },
    specialties: {
      field: "",
      constantValue: { defaultValue: getDefaultRTF("Specialties") },
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
  })),
});

const neighborhoodHealthMeetTeamFields: YextFields<NeighborhoodHealthMeetTeamSectionProps> =
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
        cardBackgroundColor: {
          label: "Card Background Color",
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
    members: teamMembersSource.field,
    memberCtas: {
      label: "Member Call to Actions",
      type: "array",
      arrayFields: {
        cta: {
          label: "Call to Action",
          type: "comprehensiveCTA",
        },
      },
      defaultItemProps: {
        cta: createDefaultCardCta("Provider Page"),
      },
      getItemSummary: (_item, index) =>
        `Member Call to Action ${(index ?? 0) + 1}`,
    },
    labels: {
      label: "Labels",
      type: "object",
      objectFields: {
        credentials: {
          type: "entityField",
          label: "Credentials Label",
          filter: { types: ["type.string"] },
        },
        licenses: {
          type: "entityField",
          label: "Licenses Label",
          filter: { types: ["type.string"] },
        },
        specialties: {
          type: "entityField",
          label: "Specialties Label",
          filter: { types: ["type.string"] },
        },
      },
    },
    cardStyles: {
      label: "Card Styles",
      type: "object",
      objectFields: {
        name: {
          label: "Name",
          type: "object",
          objectFields: {
            styles: { label: "Text Styles", type: "styledText" },
            fontColor: {
              label: "Font Color",
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
        },
        position: {
          label: "Position",
          type: "object",
          objectFields: {
            styles: { label: "Text Styles", type: "styledText" },
            fontColor: {
              label: "Font Color",
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
        },
        labels: {
          label: "Labels",
          type: "object",
          objectFields: {
            styles: { label: "Text Styles", type: "styledText" },
            fontColor: {
              label: "Font Color",
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
        },
        values: {
          label: "Values",
          type: "object",
          objectFields: {
            styles: { label: "Text Styles", type: "styledText" },
            fontColor: {
              label: "Font Color",
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
        },
      },
    },
  };

/**
 * Renders the team band with field-backed heading, member cards, image, and CTA.
 *
 * 1. Resolve editor-backed content from the current stream document.
 * 2. Apply the required section background-color contract to the shell.
 * 3. Render the provider-page action through `ComprehensiveCTA`.
 */
const NeighborhoodHealthMeetTeamSectionComponent: PuckComponent<
  NeighborhoodHealthMeetTeamSectionProps
> = ({
  cardStyles,
  heading,
  id,
  labels,
  memberCtas,
  members,
  puck,
  section,
}) => {
  const streamDocument = useDocument();
  const locale = streamDocument.locale ?? "en";
  const scopeName = `YextNeighborhoodHealthMeetTeamSection${getAnalyticsScopeHash(id)}`;
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
  const cardSurfaceStyle = getSurfaceColorStyle(
    section.cardBackgroundColor,
    streamDocument,
  );
  const resolvedMembers = teamMembersSource.resolveItems(
    members,
    streamDocument,
  );
  const resolveLabel = (label: YextEntityField<TranslatableString>) => {
    const value = resolveComponentData(label, locale, streamDocument);
    return typeof value === "string" ? value : "";
  };
  const resolvedLabels = {
    credentials: resolveLabel(labels.credentials),
    licenses: resolveLabel(labels.licenses),
    specialties: resolveLabel(labels.specialties),
  };
  const nameStyle = getTextStyles(
    cardStyles.name.styles,
    cardStyles.name.fontColor,
  );
  const positionStyle = getTextStyles(
    cardStyles.position.styles,
    cardStyles.position.fontColor,
  );
  const labelStyle = getTextStyles(
    cardStyles.labels.styles,
    cardStyles.labels.fontColor,
  );
  const richTextValueStyle = {
    ...cardStyles.values.styles,
    color:
      getThemeColorCssValue(cardStyles.values.fontColor) ??
      getThemeColorCssValue(
        getDefaultForegroundColor(section.cardBackgroundColor, streamDocument),
      ),
  };
  const imageWrapperStyle: React.CSSProperties = {
    aspectRatio: 1,
    borderRadius: "999px",
    overflow: "hidden",
  };
  const imageStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  return (
    <VisibilityWrapper
      isEditing={puck.isEditing}
      liveVisibility={section.visibleOnLivePage}
    >
      <style>{`
${baseTypographyCss}
ol, ul { list-style: revert; margin: revert; padding: revert; }

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
                displayName="Team Members"
                fieldId={members.field}
                constantValueEnabled={members.constantValueEnabled}
              >
                <div className="mt-10 grid gap-6 xl:grid-cols-2">
                  {resolvedMembers.map((member, index) => {
                    const resolvedNameValue = member.name
                      ? resolveComponentData(
                          member.name,
                          locale,
                          streamDocument,
                        )
                      : "";
                    const resolvedRoleValue = member.role
                      ? resolveComponentData(
                          member.role,
                          locale,
                          streamDocument,
                        )
                      : "";
                    const resolvedCredentialsValue = member.credentials
                      ? resolveComponentData(
                          member.credentials,
                          locale,
                          streamDocument,
                        )
                      : undefined;
                    const resolvedLicensesValue = member.licenses
                      ? resolveComponentData(
                          member.licenses,
                          locale,
                          streamDocument,
                        )
                      : undefined;
                    const resolvedSpecialtiesValue = member.specialties
                      ? resolveComponentData(
                          member.specialties,
                          locale,
                          streamDocument,
                        )
                      : undefined;
                    const resolvedImage = member.image
                      ? resolveComponentData(
                          member.image,
                          locale,
                          streamDocument,
                        )
                      : undefined;
                    const resolvedName =
                      typeof resolvedNameValue === "string"
                        ? resolvedNameValue
                        : "";
                    const resolvedRole =
                      typeof resolvedRoleValue === "string"
                        ? resolvedRoleValue
                        : "";
                    return (
                      <Background
                        key={index}
                        background={section.cardBackgroundColor}
                      >
                        <article
                          className="flex flex-col gap-6 rounded-lg border border-current/10 p-6 md:flex-row md:items-start"
                          style={cardSurfaceStyle}
                        >
                          <div className="mx-auto w-[140px] shrink-0 overflow-hidden md:mx-0">
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
                          <div className="flex-1 text-center md:text-left">
                            <h3
                              className="font-serif text-[1.9rem] leading-none tracking-[-0.04em]"
                              style={nameStyle}
                            >
                              {resolvedName}
                            </h3>
                            <p
                              className="mt-3 text-sm font-semibold md:text-base"
                              style={positionStyle}
                            >
                              {resolvedRole}
                            </p>
                            <div className="mt-4 space-y-2 text-sm leading-7 opacity-70">
                              <p>
                                <EntityField
                                  displayName="Credentials Label"
                                  fieldId={labels.credentials.field}
                                  constantValueEnabled={
                                    labels.credentials.constantValueEnabled
                                  }
                                >
                                  <strong
                                    className="font-semibold"
                                    style={labelStyle}
                                  >
                                    {resolvedLabels.credentials}:
                                  </strong>
                                </EntityField>{" "}
                                {renderResolvedRichText(
                                  resolvedCredentialsValue,
                                  richTextValueStyle,
                                )}
                              </p>
                              <p>
                                <EntityField
                                  displayName="Licenses Label"
                                  fieldId={labels.licenses.field}
                                  constantValueEnabled={
                                    labels.licenses.constantValueEnabled
                                  }
                                >
                                  <strong
                                    className="font-semibold"
                                    style={labelStyle}
                                  >
                                    {resolvedLabels.licenses}:
                                  </strong>
                                </EntityField>{" "}
                                {renderResolvedRichText(
                                  resolvedLicensesValue,
                                  richTextValueStyle,
                                )}
                              </p>
                              <div>
                                <EntityField
                                  displayName="Specialties Label"
                                  fieldId={labels.specialties.field}
                                  constantValueEnabled={
                                    labels.specialties.constantValueEnabled
                                  }
                                >
                                  <strong
                                    className="font-semibold"
                                    style={labelStyle}
                                  >
                                    {resolvedLabels.specialties}:
                                  </strong>
                                </EntityField>{" "}
                                {renderResolvedRichText(
                                  resolvedSpecialtiesValue,
                                  richTextValueStyle,
                                )}
                              </div>
                            </div>
                            {memberCtas[index]?.cta ? (
                              <ComprehensiveCTA
                                className="mt-5 max-w-full w-fit whitespace-normal break-words border-b border-current/15 pb-1 no-underline transition hover:border-current hover:no-underline"
                                eventName={`card${index}`}
                                value={
                                  memberCtas[index]
                                    .cta as unknown as Partial<ComprehensiveCTAValue>
                                }
                              />
                            ) : null}
                          </div>
                        </article>
                      </Background>
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

export const NeighborhoodHealthMeetTeamSection: YextComponentConfig<NeighborhoodHealthMeetTeamSectionProps> =
  {
    label: "Meet Team Section",
    fields: toPuckFields<NeighborhoodHealthMeetTeamSectionProps>(
      neighborhoodHealthMeetTeamFields,
    ),
    defaultProps: {
      memberCtas: Array.from({ length: 4 }, () => ({
        cta: createDefaultCardCta("Provider Page"),
      })),
      labels: {
        licenses: {
          field: "",
          constantValue: {
            defaultValue: "Licenses",
          },
          constantValueEnabled: true,
        },
        credentials: {
          field: "",
          constantValue: {
            defaultValue: "Credentials",
          },
          constantValueEnabled: true,
        },
        specialties: {
          field: "",
          constantValue: {
            defaultValue: "Specialties",
          },
          constantValueEnabled: true,
        },
      },
      heading: {
        text: {
          field: "",
          constantValue: {
            hasLocalizedValue: "true",
            defaultValue: "Meet our Providers",
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
      members: teamMembersSource.defaultValue,
      section: {
        visibleOnLivePage: true,
        backgroundColor: {
          selectedColor: "palette-primary",
          contrastingColor: "palette-primary-contrast",
        },
        cardBackgroundColor: {
          selectedColor: "palette-primary",
          contrastingColor: "palette-primary-contrast",
        },
      },
      cardStyles: {
        name: {
          styles: {
            fontSize: "default",
            fontStyle: "default",
            fontFamily: "default",
            fontWeight: "default",
            textTransform: "default",
          },
        },
        labels: {
          styles: {
            fontSize: "default",
            fontStyle: "default",
            fontFamily: "default",
            fontWeight: "default",
            textTransform: "default",
          },
        },
        values: {
          styles: {
            fontSize: "default",
            fontStyle: "default",
            fontFamily: "default",
            fontWeight: "default",
            textTransform: "default",
          },
        },
        position: {
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
    render: (props) => (
      <NeighborhoodHealthMeetTeamSectionComponent {...props} />
    ),
  };

export const config: SectionConfig = {
  id: "NeighborhoodHealthMeetTeamSection",
  displayName: "Meet Team Section",
  description: "Meet Team Section",
  pageSetTypes: ["ENTITY"],
};
