// // index.js
// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const { parseAndProcess } = require('./processor');

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));

// // ── Fill in YOUR details here ──
// const USER_ID = 'yourname_ddmmyyyy';       // e.g. 'johndoe_17091999'
// const EMAIL_ID = 'you@srmist.edu.in';
// const ROLL_NUMBER = 'RA2211003XXXXXX';
// // ────────────────────────────────

// app.post('/bfhl', (req, res) => {
//   const { data } = req.body;

//   if (!Array.isArray(data)) {
//     return res.status(400).json({ error: 'data must be an array' });
//   }

//   const { hierarchies, invalidEntries, duplicateEdges, summary } = parseAndProcess(data);

//   res.json({
//     user_id: USER_ID,
//     email_id: EMAIL_ID,
//     college_roll_number: ROLL_NUMBER,
//     hierarchies,
//     invalid_entries: invalidEntries,
//     duplicate_edges: duplicateEdges,
//     summary
//   });
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));