import type { SectionConfig } from "@yext/visual-editor";

import type { PuckComponent } from "@puckeditor/core";
import { useTranslation } from "react-i18next";
import { AnalyticsScopeProvider, Link } from "@yext/pages-components";
import {
  msg,
  Background,
  EntityField,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  resolveBreadcrumbs,
  resolveComponentData,
  toPuckFields,
  useDocument,
  useTemplateProps,
  type TranslatableString,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  VisibilityWrapper,
  pt,
} from "@yext/visual-editor";
import { baseTypographyCss, type SectionProps } from "../shared/sectionHelpers";

type NeighborhoodHealthBreadcrumbsProps = {
  includeCurrentLocation: boolean;
  rootLabel: YextEntityField<TranslatableString>;
  section: SectionProps;
};

const neighborhoodHealthBreadcrumbsFields: YextFields<NeighborhoodHealthBreadcrumbsProps> =
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
    rootLabel: {
      label: msg("fields.rootLabel", "Root Label"),
      type: "entityField",
      filter: {
        types: ["type.string"],
      },
    },
    includeCurrentLocation: {
      label: msg("fields.includeCurrentLocation", "Include Current Location"),
      type: "radio",
      options: [
        { label: msg("fields.options.yes", "Yes"), value: true },
        { label: msg("fields.options.no", "No"), value: false },
      ],
    },
  };

/**
 * Renders the directory path for the current location.
 *
 * 1. Resolve live breadcrumb items and the configurable root label.
 * 2. Prefix directory links for the active template path.
 * 3. Render the current location from the stream document when enabled.
 */
const NeighborhoodHealthBreadcrumbsComponent: PuckComponent<
  NeighborhoodHealthBreadcrumbsProps
> = ({ id, includeCurrentLocation, puck, rootLabel, section }) => {
  const streamDocument = useDocument();
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const { relativePrefixToRoot } = useTemplateProps<{
    relativePrefixToRoot?: string;
  }>();
  const breadcrumbs = resolveBreadcrumbs(streamDocument);
  const resolvedRootLabelValue = resolveComponentData(
    rootLabel,
    locale,
    streamDocument,
  );
  const resolvedRootLabel =
    typeof resolvedRootLabelValue === "string" ? resolvedRootLabelValue : "";
  const sectionStyle = getSurfaceColorStyle(
    section.backgroundColor,
    streamDocument,
  );
  const visibleBreadcrumbs =
    includeCurrentLocation || breadcrumbs.length <= 1
      ? breadcrumbs
      : breadcrumbs.slice(0, -1);

  if (!visibleBreadcrumbs.length) {
    return puck.isEditing ? (
      <p
        style={{
          fontFamily: "Arial, Helvetica, sans-serif",
          padding: "18px 24px",
        }}
      >
        {pt(
          "breadcrumbsUnavailable",
          "No breadcrumbs available (section will be hidden on live page). Create a directory to enable breadcrumbs.",
        )}
      </p>
    ) : (
      <></>
    );
  }

  return (
    <VisibilityWrapper
      isEditing={puck.isEditing}
      liveVisibility={section.visibleOnLivePage}
    >
      <style>{`
${baseTypographyCss}

      `}</style>
      <AnalyticsScopeProvider
        name={`NeighborhoodHealthBreadcrumbs${getAnalyticsScopeHash(id)}`}
      >
        <Background
          as="section"
          background={section.backgroundColor}
          className="border-b border-black/10 px-6 py-4 md:px-8 lg:px-10"
          style={sectionStyle}
        >
          <nav aria-label={t("breadcrumb", "Breadcrumb")}>
            <ol className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-y-1 text-xs uppercase tracking-[0.14em] md:text-sm">
              {visibleBreadcrumbs.map((breadcrumb, index) => {
                const isCurrentLocation = index === breadcrumbs.length - 1;
                const label =
                  index === 0 && resolvedRootLabel
                    ? resolvedRootLabel
                    : isCurrentLocation
                      ? streamDocument.name || breadcrumb.name
                      : breadcrumb.name;
                const href = relativePrefixToRoot
                  ? relativePrefixToRoot + breadcrumb.slug
                  : breadcrumb.slug;

                return (
                  <li
                    key={`${breadcrumb.slug}-${index}`}
                    className="flex items-center"
                  >
                    {index > 0 ? (
                      <span aria-hidden="true" className="mx-3 opacity-45">
                        /
                      </span>
                    ) : null}
                    {isCurrentLocation ? (
                      <span aria-current="page">{label}</span>
                    ) : index === 0 ? (
                      <EntityField
                        displayName="Root Label"
                        fieldId={rootLabel.field}
                        constantValueEnabled={rootLabel.constantValueEnabled}
                      >
                        <Link
                          className="transition hover:opacity-60"
                          href={href}
                        >
                          {label}
                        </Link>
                      </EntityField>
                    ) : (
                      <Link className="transition hover:opacity-60" href={href}>
                        {label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </Background>
      </AnalyticsScopeProvider>
    </VisibilityWrapper>
  );
};

export const NeighborhoodHealthBreadcrumbs: YextComponentConfig<NeighborhoodHealthBreadcrumbsProps> =
  {
    label: "Breadcrumbs",
    fields: toPuckFields<NeighborhoodHealthBreadcrumbsProps>(
      neighborhoodHealthBreadcrumbsFields,
    ),
    defaultProps: {
      section: {
        backgroundColor: {
          selectedColor: "white",
          contrastingColor: "black",
        },
        visibleOnLivePage: true,
      },
      rootLabel: {
        field: "",
        constantValue: {
          defaultValue: "Locations",
        },
        constantValueEnabled: true,
      },
      includeCurrentLocation: true,
    },
    render: (props) => <NeighborhoodHealthBreadcrumbsComponent {...props} />,
  };

export const config: SectionConfig = {
  id: "NeighborhoodHealthBreadcrumbs",
  displayName: "Breadcrumbs",
  description: "Breadcrumbs",
  pageSetTypes: ["ENTITY"],
};
