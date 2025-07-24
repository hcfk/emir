# Visual Data Core: Go Plugin Development Guide

The Visual Data Core platform supports high-performance backend plugins written in Go, providing developers with the ability to create robust data source connectors, processing modules, and backend services.

---

## 🧩 What is a Go Plugin?
A Go plugin is a backend service that communicates with the Visual Data Core platform via gRPC. It acts as a self-contained process, designed for high-speed and low-memory operations, ideal for:

- Data source plugins (InfluxDB, Prometheus, etc.)
- Stream processors
- Alerting engines
- Real-time analytics workers

---

## 📁 Folder Structure
Go plugins live in the `plugins/go/` directory:

```
plugins/
└── go/
    └── influxdb-plugin/
        ├── plugin.json
        ├── main.go
        ├── handler.go
        ├── proto/
        └── README.md
```

---

## 📦 plugin.json (Required)
```json
{
  "type": "go",
  "id": "influxdb-plugin",
  "name": "InfluxDB Go Plugin",
  "description": "A native Go plugin for querying InfluxDB.",
  "binary": "./dist/influxdb-plugin"
}
```

- `binary` refers to the compiled Go binary path relative to the plugin folder.

---

## ⚙️ main.go (Entrypoint)
```go
package main

import (
  "log"
  "net"
  "google.golang.org/grpc"
  "myplugin/proto"
)

func main() {
  lis, err := net.Listen("tcp", ":50051")
  if err != nil {
    log.Fatalf("failed to listen: %v", err)
  }
  grpcServer := grpc.NewServer()
  proto.RegisterPluginServer(grpcServer, &PluginServer{})
  log.Println("Go Plugin started on port 50051")
  grpcServer.Serve(lis)
}
```

---

## 🧠 handler.go (Business Logic)
```go
type PluginServer struct {
  proto.UnimplementedPluginServer
}

func (s *PluginServer) Query(ctx context.Context, req *proto.QueryRequest) (*proto.QueryResponse, error) {
  // Handle your logic here
  return &proto.QueryResponse{Data: "Result from Go plugin"}, nil
}
```

---

## 📡 Communication via gRPC
Visual Data Core will manage plugin processes and connect via gRPC. You must implement the expected interfaces defined in `proto/plugin.proto`.

> Note: We will provide `proto/plugin.proto` in a shared SDK repo to standardize communication.

---

## 🛠 Build & Register
```bash
# Build the Go binary
cd plugins/go/influxdb-plugin
go build -o dist/influxdb-plugin .

# The platform auto-registers based on plugin.json
```

---

## 🧪 Testing
Use the gRPC test clients or curl-like gRPC tools (e.g., `grpcurl`) to test your plugin before integration.

---

## 🔐 Security & Stability
- Plugins run in isolated processes
- API keys must be passed via environment variables or securely stored config files
- Log errors clearly for observability

---

## 📈 Use Cases
- Go plugin for real-time metric ingestion
- High-speed alert rule evaluation
- Edge computing plugin written in Go
- Low-latency data source for IoT sensors

---

## 📖 Resources
- [Go gRPC Docs](https://grpc.io/docs/languages/go/)
- [Protocol Buffers](https://developers.google.com/protocol-buffers)

---

Visual Data Core opens up plugin development for polyglot environments.
With Go, you build blazing-fast, production-ready backend services.

Ready to build your first Go plugin? 🚀

