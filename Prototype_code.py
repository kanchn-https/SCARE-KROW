from ultralytics import YOLO
import cv2

# Load pre-trained YOLO model (trained on COCO)
model = YOLO("yolov5s.pt")  # small & fast model

# Open laptop camera
cap = cv2.VideoCapture(0)

# Safety check
if not cap.isOpened():
    print("Error: Camera not accessible")
    exit()

while True:
    ret, frame = cap.read()
    if not ret:
        print("Failed to capture frame")
        break

    # Run detection
    results = model(frame)

    # Draw results on frame
    for result in results:
        boxes = result.boxes
        for box in boxes:
            cls = int(box.cls[0])
            label = model.names[cls]

            if label == "bird":  # detect only birds
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                confidence = float(box.conf[0])

                # Draw box + label
                cv2.rectangle(frame, (x1, y1), (x2, y2), 2)
                cv2.putText(frame, f"{label} {confidence:.2f}", (x1, y1-10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)

    # Show live feed
    cv2.imshow("Bird Detection", frame)

    # Exit on 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
