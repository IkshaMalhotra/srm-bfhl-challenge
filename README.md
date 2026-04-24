# BFHL Graph Hierarchy Analyzer

A full-stack application designed to analyze and visualize complex node relationships including trees and cycles. This project was developed for the SRM Full Stack Engineering Challenge.

## Project URLs
- Frontend: https://srm-bfhl-challenge-jgyq.onrender.com/
- API Base URL: https://srm-bfhl-challenge-jgyq.onrender.com
- API Endpoint: POST /bfhl

## Tech Stack
- Frontend: HTML5, CSS3, JavaScript (Canvas API)
- Backend: Node.js, Express.js
- Deployment: Render

## API Specification

### Endpoint: POST /bfhl
Processes an array of string-based edges (format: "X->Y") and returns structured hierarchies.

#### Request Body
{
  "data": ["A->B", "B->C", "A->C"]
}

#### Response Format
{
  "user_id": "iksha_malhotra_16032005",
  "email id": "im1737@srmist.edu.in",
  "college roll number": "RA2311003030242",
  "hierarchies": [...],
  "invalid entries": [],
  "duplicate edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 0,
    "largest_tree_root": "A"
  }
}

## Core Functionality
- Hierarchy Processing: Builds tree structures from raw edge data.
- Cycle Detection: Identifies circular dependencies within nodes.
- Diamond Case Handling: Resolves multi-parent conflicts by prioritizing the first encountered edge.
- Sorting: Tie-breakers for the largest tree are handled lexicographically by the root node name.
- Dynamic Visualization: Renders node relationships on a responsive canvas.

## Project Structure
- /public: Contains frontend assets (index.html, styles.css).
- server.js: Main Express server and graph processing logic.
- package.json: Backend dependencies and scripts.

## Author Information
- Name: Iksha Malhotra
- Roll Number: RA2311003030242
- Department: B.Tech CSE CORE
- Institution: SRM Institute of Science and Technology
