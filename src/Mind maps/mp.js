import React from "react";
import MindMap from "./mpex";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "./App.css"; // Import CSS for styling

const MindMapsApp = {
    "id": 1,
    "title": "Mechanics",
    "children": [
      {
        "id": 2,
        "title": "Kinematics",
        "parent": 1,
        "children": [
          {
            "id": 3,
            "title": "Motion in One Dimension",
            "parent": 2,
            "children": [
              {
                "id": 4,
                "title": "Equations of Motion",
                "parent": 3,
                "children": [
                  { "id": 5, "title": "Derivation using Calculus", "parent": 4, "children": [] },
                  { "id": 6, "title": "Applications", "parent": 4, "children": [] }
                ]
              },
              {
                "id": 7,
                "title": "Velocity-Time Graphs",
                "parent": 3,
                "children": [
                  {
                    "id": 8,
                    "title": "Slope Interpretation",
                    "parent": 7,
                    "children": [
                      { "id": 9, "title": "Acceleration from Slope", "parent": 8, "children": [] }
                    ]
                  },
                  { "id": 10, "title": "Area under Graph", "parent": 7, "children": [] }
                ]
              }
            ]
          },
          {
            "id": 11,
            "title": "Motion in Two Dimensions",
            "parent": 2,
            "children": [
              {
                "id": 12,
                "title": "Projectile Motion",
                "parent": 11,
                "children": [
                  {
                    "id": 13,
                    "title": "Horizontal and Vertical Components",
                    "parent": 12,
                    "children": [
                      { "id": 14, "title": "Time of Flight", "parent": 13, "children": [] },
                      { "id": 15, "title": "Range of Projectile", "parent": 13, "children": [] }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": 16,
        "title": "Dynamics",
        "parent": 1,
        "children": [
          {
            "id": 17,
            "title": "Newton's Laws of Motion",
            "parent": 16,
            "children": [
              {
                "id": 18,
                "title": "First Law (Inertia)",
                "parent": 17,
                "children": [
                  { "id": 19, "title": "Types of Inertia", "parent": 18, "children": [] }
                ]
              },
              {
                "id": 20,
                "title": "Second Law (F = ma)",
                "parent": 17,
                "children": [
                  {
                    "id": 21,
                    "title": "Momentum and Impulse",
                    "parent": 20,
                    "children": [
                      { "id": 22, "title": "Conservation of Momentum", "parent": 21, "children": [] }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
  

const App = () => {
  return (
    <div className="app-container">
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={2}
        wheel={{ step: 0.1 }}
        pinch={{ step: 0.05 }} // Enable smooth pinch zoom
        doubleClick={{ disabled: true }} // Disable double-tap zoom
      >
        <TransformComponent>
          <div className="mindmap-container">
            <MindMap data={MindMapsApp} />
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default App;
