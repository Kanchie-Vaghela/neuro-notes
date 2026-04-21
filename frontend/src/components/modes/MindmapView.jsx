import React, { useMemo } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

const MindmapView = ({ data }) => {
  // 🧹 Step 1: Ensure data is real JSON
  const parsedData = useMemo(() => {
    try {
      if (typeof data === "string") {
        return JSON.parse(data);
      }
      return data;
    } catch (err) {
      console.error("Invalid JSON:", err);
      return [];
    }
  }, [data]);

  // 🔥 Step 2: Convert tree → nodes + edges (fixed layout)
  const { nodes, edges } = useMemo(() => {
    let nodes = [];
    let edges = [];
    let yOffset = 0; // global vertical tracker

    const traverse = (node, parentId = null, level = 0) => {
      const id = `${node.title}-${yOffset}`;

      nodes.push({
        id,
        data: { label: node.title },
        position: {
          x: level * 250,
          y: yOffset * 100,
        },
        style: {
          padding: 10,
          borderRadius: 10,
          border: "1px solid #ddd",
          background: "#ffffff",
          fontSize: "12px",
        },
      });

      if (parentId) {
        edges.push({
          id: `${parentId}-${id}`,
          source: parentId,
          target: id,
        });
      }

      yOffset++;

      node.children?.forEach((child) => {
        traverse(child, id, level + 1);
      });
    };

    parsedData?.forEach((root) => {
      traverse(root);
    });

    return { nodes, edges };
  }, [parsedData]);

  // 🧱 Step 3: Render (proper container sizing)
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default MindmapView;