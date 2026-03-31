import React, { useMemo } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

const MindmapView = ({ data }) => {

  // 🔥 Convert tree → nodes + edges
  const { nodes, edges } = useMemo(() => {
    let nodes = [];
    let edges = [];

    const traverse = (node, parentId = null, level = 0, index = 0) => {
      const id = `${node.title}-${level}-${index}`;

      nodes.push({
        id,
        data: { label: node.title },
        position: {
          x: level * 250,
          y: index * 120,
        },
        style: {
          padding: 10,
          borderRadius: 10,
          border: "1px solid #ddd",
          background: "#ffffff",
        },
      });

      if (parentId) {
        edges.push({
          id: `${parentId}-${id}`,
          source: parentId,
          target: id,
        });
      }

      node.children?.forEach((child, i) => {
        traverse(child, id, level + 1, i);
      });
    };

    data.forEach((root, i) => {
      traverse(root, null, 0, i);
    });

    return { nodes, edges };
  }, [data]);

  return (
    <div className="h-[500px] bg-white rounded-2xl border shadow-sm">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default MindmapView;