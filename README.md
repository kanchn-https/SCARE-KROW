# SCARE-KROW

Title Video: https://drive.google.com/file/d/1XnCnLt9TcTxKtBt9zFMHZvuGuFZz5d5D/view?usp=sharing

# Problem
Birds often land in crop fields to feed on seeds, fruits, and plants, which can cause noticeable loss in crop quality and yield. Farmers currently rely on conventional deterrent methods-like static scare models, reflective materials, or looped sound devices-that do not adjust based on real bird landings, making them labor-heavy and less effective for large active farm areas.

# Our Solution
This is basically a updated version of traditional Scare Crows, this project addresses the need for a real-time, ethical, and harmless bird dispersal prototype, using a laptop’s built-in camera (till now later
extend it to a webcam so that real time monitoring happens) as the main detection source during initial testing and prototyping. The system is built to:
-> Recognize birds from a live video stream
-> Track their movement inside the camera frame
-> Trigger a loud, safe sound that encourages birds to fly away naturally, without physical interaction or harm.

Link (how our model looks like): 
https://drive.google.com/file/d/1IQZSFVw2uQV7AbpaAxmzRsITuK8lvG5G/view?usp=sharing
https://drive.google.com/file/d/1Q3t_bJQJsvsWvkTYrrz7xs8w0nwrPjy4/view?usp=sharing

# Goal
The main challenge is to build a fast, easy to use and wildlife-safe system to reduce crop damage from birds landing in the fields.

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# How Our Prototype Works?
Bird Detection
1. The laptop camera gives live video.
2. Each frame is checked to spot birds.
3. When a bird is detected, a loud safe sound plays to scare it away.
4. A box and score show the detection on the screen.
Bird Tracking 
1. The system can follow the bird's movement by noting the center of the box.
Scare Sound
1. Sound is triggered at the moment the bird appears in the camera view.
Live Visualization
1. The laptop screen keeps showing the camera feed with the box, score, and sound action.

# Prototype:
https://drive.google.com/file/d/1ySxONb1aam1_WTlZ66-H-rN6bfbyyXLg/view?usp=sharing

Workflow:

                  Camera (for detection)
                    |
                    V
                  Frame (for tracking)
                    |
                    V
                Check bird?  <-------   
                    |               |
                    V               |
                  Feedback          |
                (Box + Sound) -------

Links of workflow and operation flow: 
https://drive.google.com/file/d/1mC383psa0BJKUY2BitQ7G8oBiHy2fbxB/view?usp=sharing
https://drive.google.com/file/d/1nLR0IHZqCkJiVmk7KPp4nsYP09xiYXfq/view?usp=sharing


# ADVANTAGES

# Feasibility
The prototype can work using a laptop camera or webcam.
It detects birds in real time using a light AI model.
No internet is needed because files run from the device.
# Scalability
This stage supports only one camera view at a time.
Detection runs again and again in a loop, but not on many cameras together yet.
# Sustainability
The system does not harm birds.
It works using normal power and keeps the design simple for testing.

--------------------------------------------------------------------------------------------------------------------------------

# Improvements for Round2 

1. Handling Large Land
A dashboard is a simple screen that shows what’s happening in a big farm area at once.
It makes monitoring easy without checking different cameras separately as the farm land has many scarecrows, and all of them are watched and controlled from one dashboard screen.
2. Detect more animals
The model will not only spot birds but also animals that damage crops.
This helps protect crops better and reduces yield loss.
3. Night Vision Tracking(without sound)
At night, birds and animals react quickly to light or laser.
So the system uses laser to scare them, and sound is turned off to keep the field quiet and avoid disturbance.
4. Sustainable
The system is planned to run on solar panels for clean and energy-independent operation.


# ADVANTAGES

# Feasibility
The idea can work on large land with many scare units.
All units can be managed from one main screen.
# Scalability
It can monitor wide fields and detect more crop-damaging birds and animals.
Many scare points update on the same screen for easy use.
# Sustainability
No sound is used at night to keep the farm quiet.
Laser or light is used to scare in the dark, which is natural for animals.
Solar power support can be added to make it earth-friendly and convenient.



