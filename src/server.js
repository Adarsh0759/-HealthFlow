
const http = require("http");

const PORT = process.env.PORT || 3000;

const patients = [
  { id: 1, name: "Patient Demo 1", age: 35, condition: "General Checkup" },
  { id: 2, name: "Patient Demo 2", age: 42, condition: "Routine Follow-up" }
];

const doctors = [
  { id: 1, name: "Dr. Demo One", specialty: "General Medicine" },
  { id: 2, name: "Dr. Demo Two", specialty: "Cardiology" }
];

const appointments = [
  { id: 1, patientId: 1, doctorId: 1, status: "Scheduled" }
];

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200);
    return res.end(JSON.stringify({
      application: "HealthFlow",
      message: "Healthcare Management API",
      version: "2.0.0"
    }));
  }

  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200);
    return res.end(JSON.stringify({ status: "healthy" }));
  }

  if (req.method === "GET" && req.url === "/api/patients") {
    res.writeHead(200);
    return res.end(JSON.stringify(patients));
  }

  if (req.method === "GET" && req.url === "/api/doctors") {
    res.writeHead(200);
    return res.end(JSON.stringify(doctors));
  }

  if (req.method === "GET" && req.url === "/api/appointments") {
    res.writeHead(200);
    return res.end(JSON.stringify(appointments));
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Route not found" }));
});

if (require.main === module) {
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`HealthFlow running on port ${PORT}`);
  });
}

module.exports = server;
