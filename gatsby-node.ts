import path from 'path';
import isCi from 'is-ci';

import type { GatsbyNode } from 'gatsby';

type ContentfulPage = {
    contentful_id: string;
    slug: string;
};

type PageQueryResult = {
    errors?: any;
    data?: { allContentfulPage: { nodes: ContentfulPage[] } };
};

export const createPages: GatsbyNode['createPages'] = async ({ graphql, actions }) => {
    console.log(`ENV check`, {
        isCi,
        GATSBY_EXPERIMENTAL_DISABLE_SCHEMA_REBUILD: process.env.GATSBY_EXPERIMENTAL_DISABLE_SCHEMA_REBUILD,
        GATSBY_ENABLE_QUERY_ON_DEMAND_IN_CI: process.env.GATSBY_ENABLE_QUERY_ON_DEMAND_IN_CI,
        GATSBY_QUERY_ON_DEMAND: process.env.GATSBY_QUERY_ON_DEMAND
    });

    const { createPage } = actions;
    const ComposablePage = path.resolve(`src/templates/composable-page.tsx`);
    const result: PageQueryResult = await graphql(`
        query PageGeneratorQuery {
            allContentfulPage {
                nodes {
                    contentful_id
                    slug
                }
            }
        }
    `);

    result.data?.allContentfulPage.nodes.forEach((edge: ContentfulPage) => {
        createPage({
            path: `${edge.slug}`,
            component: ComposablePage,
            context: { slug: edge.slug },
            ownerNodeId: edge.contentful_id
        });
    });
};
