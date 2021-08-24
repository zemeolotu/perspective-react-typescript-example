import * as React from "react";
import * as ReactDOM from "react-dom";
import { useEffect, useRef } from "react";
import perspective, { Table } from "@finos/perspective";


import "@finos/perspective-workspace";
import "@finos/perspective-viewer-datagrid";
import "@finos/perspective-viewer-d3fc";
import "./index.css";
import "@finos/perspective-workspace/dist/umd/material.dark.css";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'perspective-workspace': any;
        }
    }

    interface Document {
        createElement(tagName: "perspective-workspace"): any;
    }
}



const DEFAULT_LAYOUT = {
    detail: {
        main: {
            type: "split-area",
            orientation: "horizontal",
            children: [
                {
                    type: "tab-area",
                    widgets: ["One"],
                    currentIndex: 0
                },
                {
                    type: "split-area",
                    orientation: "vertical",
                    children: [
                        {
                            type: "tab-area",
                            widgets: ["Two"],
                            currentIndex: 0
                        },
                        {
                            type: "tab-area",
                            widgets: ["Three"],
                            currentIndex: 0
                        }
                    ],
                    sizes: [0.5, 0.5]
                }
            ],
            sizes: [0.5, 0.5]
        }
    },
    mode: "globalFilters",
    viewers: {
        One: {
            plugin: "Heatmap",
            columns: ["Profit"],
            "row-pivots": ["Sub-Category"],
            "column-pivots": ["State"],
            table: "superstore",
        },
        Two: {
            plugin: "Y Bar",
            "row-pivots": ["Category"],
            columns: ["Profit"],
            "column-pivots": ["Sub-Category"],
            name: "Profit By Category",
            table: "superstore",
        },
        Three: {
            "row-pivots": [
                "State"
            ],
            columns: [
                "Sales",
                "Profit",
                null
            ],
            plugin: "Treemap",
            sort: [
                [
                    "Profit",
                    "desc"
                ]
            ],

            name: "Sales/Profit By State",
            table: "superstore",

        }
    }
}


const worker = perspective.shared_worker();

const getTable = async (): Promise<Table> => {
    const req = fetch("https://unpkg.com/superstore-arrow@1.0.0/superstore.arrow");
    const resp = await req;
    const buffer = await resp.arrayBuffer();
    return await worker.table(buffer as any);
};

const App = (): React.ReactElement => {
    const workspace = useRef<any>(null);

    useEffect(() => {
        getTable().then(table => {
            if (workspace.current) {

                workspace.current.tables.set("superstore", table);
                workspace.current.restore(DEFAULT_LAYOUT);
            }
        });
    }, []);

    return <perspective-workspace ref={workspace} ></perspective-workspace>;
};
window.addEventListener("load", () => {
    ReactDOM.render(<App />, document.getElementById("root"));
});
