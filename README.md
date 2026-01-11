# SCARE-KROW

Title Video: https://drive.google.com/file/d/1XnCnLt9TcTxKtBt9zFMHZvuGuFZz5d5D/view?usp=sharing

# Problem
Birds often land in crop fields to feed on seeds, fruits, and plants, which can cause noticeable loss in crop quality and yield. Farmers currently rely on conventional deterrent methods-like static scare models, reflective materials, or looped sound devices-that do not adjust based on real bird landings, making them labor-heavy and less effective for large active farm areas.

# Our Solution
ScareCrow is a smart crop-protection system designed to detect bird activity and respond in real time. Multiple AI-enabled scarecrow units are deployed across agricultural fields, where each unit independently identifies birds using camera-based detection and triggers immediate deterrent actions.

All scarecrow units are connected to a single centralized dashboard that displays live status, detection alerts, and activity updates. This allows farmers to monitor and manage large field areas efficiently from one place. The system supports both day and night operation, ensuring continuous crop safety with minimal manual intervention.
This is basically a updated version of traditional Scare Crows, this project addresses the need for a real-time, ethical, and harmless bird dispersal prototype, using a laptop’s built-in camera as the main detection source during initial testing and prototyping. The system is built to:
-> Camera detects birds automatically and responds quickly
-> One dashboard monitors all scarecrows together
-> System works both day and night without manual effort

Link (how our model looks like): 
https://drive.google.com/file/d/1IQZSFVw2uQV7AbpaAxmzRsITuK8lvG5G/view?usp=sharing
https://drive.google.com/file/d/1Q3t_bJQJsvsWvkTYrrz7xs8w0nwrPjy4/view?usp=sharing

# Goal
The main challenge is to build a fast, easy to use and wildlife-safe system to reduce crop damage from birds landing in the fields.

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# How Our Prototype Works?
1. Multiple Scarecrow Units -> Send live status and detection data
2. Detection Events -> Transmitted to central system
3. Central System -> Aggregates data from all scarecrows
4. Single Dashboard  ->  Displays real-time activity of each unit
5. Dashboard View  -> Shows scarecrow ID, status, and alerts
6. Real-Time Updates  -> Enable remote field monitoring
7. Centralized Display  ->  Eliminates need for on-site inspection

# Prototype:
Round2 -> https://drive.google.com/file/d/1UOhEsdXtIBkOFTAjEot-hVMHzmf4ERAZ/view?usp=sharing
Round1 -> https://drive.google.com/file/d/1ySxONb1aam1_WTlZ66-H-rN6bfbyyXLg/view?usp=sharing

Workflow:

      ( Scarecrow 01 )        ( Scarecrow 02 )        ( Scarecrow 03 )
     ----------------        ----------------        ----------------

      Camera                   Camera                   Camera
        |                        |                        |
        V                        V                        V
     Frame                    Frame                    Frame
        |                        |                        |
        V                        V                        V
        Check bird?              Check bird?              Check bird?
        |                        |                        |
        | YES                    | YES                    | YES
        V                        V                        V
      Feedback                   Feedback                   Feedback
      (Box + Sound)              (Box + Sound)              (Box + Sound)
        |                        |                        |
        +----------- Status / Event Data ---------------+
                            |
                            V
                 Central Backend / Cloud
                            |
                            V
                Single Central Dashboard
            (Monitor & Control ALL Scarecrows)


Links of workflow and operation flow: 
round 2-> https://drive.google.com/file/d/1wJPz00NoqdbuYAHSdZuI4W7dehP80B43/view?usp=sharing
Round 1-> https://drive.google.com/file/d/1mC383psa0BJKUY2BitQ7G8oBiHy2fbxB/view?usp=sharing
          https://drive.google.com/file/d/1nLR0IHZqCkJiVmk7KPp4nsYP09xiYXfq/view?usp=sharing


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



