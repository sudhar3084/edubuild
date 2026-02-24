import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
import Project from './models/Project.js'; // Adjust path if needed
import { sequelize } from './config/db.js';

dotenv.config();

const projects = [
    {
        title: 'Balloon-Powered Car',
        description: 'A DIY vehicle that demonstrates Newtons Third Law of Motion. It uses the stored potential energy in a balloon to create kinetic energy, propelling the car forward as air escapes.',
        budget: 20,
        classLevel: '6-8',
        subject: 'Physics',
        materials: ["Empty plastic bottle", "4 bottle caps", "2 plastic straws", "1 balloon", "2 wooden skewers", "Adhesive tape", "Scissors"],
        steps: ["Cut two straws to a length slightly wider than the plastic bottle.", "Tape these two straws horizontally across the bottom of the bottle to act as axle holders.", "Poke a hole in the center of each of the 4 bottle caps using a pin or nail.", "Slide a wooden skewer through one straw and attach bottle caps to both ends to create wheels.", "Repeat the process for the second skewer and straw to complete the four-wheel base.", "Secure the neck of a balloon onto the end of a third straw using tight tape (ensure it is airtight).", "Cut a small hole in the top of the bottle and thread the straw through so the balloon sits on top.", "Blow through the straw to inflate the balloon, pinch the end, place the car on a flat surface, and let go!"],
        learningOutcomes: ["Newtons Third Law", "Kinetic vs Potential Energy", "Friction"],
        difficulty: 'Easy',
        rating: 4.8,
        image: 'https://plus.unsplash.com/premium_photo-1664302152990-67c94b7e937d?q=80&w=2832&auto=format&fit=crop',
        videoUrl: 'https://youtube.com/watch?v=example-balloon-car',
        status: 'approved',
        createdBy: '550e8400-e29b-41d4-a716-446655440002'
    },
    {
        title: 'Hydraulic Cardboard Arm',
        description: 'A mechanical arm that uses water pressure to move. It demonstrates Pascals Law, showing how pressure applied to a confined fluid is transmitted undiminished.',
        budget: 150,
        classLevel: '6-8',
        subject: 'Physics',
        materials: ["Cardboard", "4 Plastic syringes (10ml)", "Old IV tubes or flexible pipes", "Water (colored with ink)", "Zip ties or wire", "Glue gun"],
        steps: ["Cut cardboard into four long strips for the arm segments and a square base.", "Join segments using wire pivots so they can move freely.", "Connect two syringes with the IV tubing and fill them with colored water (remove air bubbles).", "Mount one syringe to the cardboard arm and the other to the base to act as the controller.", "Pushing the controller syringe will force water into the arm syringe, extending the arm."],
        learningOutcomes: ["Pascals Law", "Hydraulics", "Mechanical Engineering"],
        difficulty: 'Medium',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
        status: 'approved',
        createdBy: '550e8400-e29b-41d4-a716-446655440002'
    },
    {
        title: 'CD Hovercraft',
        description: 'A simple craft that glides on a thin cushion of air. It teaches students about air pressure, friction reduction, and Newtons Second Law.',
        budget: 10,
        classLevel: '6-8',
        subject: 'Physics',
        materials: ["Old CD or DVD", "Balloon", "Dish soap bottle pull-top cap", "Super glue or Hot glue"],
        steps: ["Close the pop-top cap of the dish soap bottle.", "Glue the base of the cap over the center hole of the CD, ensuring an airtight seal.", "Inflate a balloon and stretch its neck over the closed pop-top cap.", "Place the CD on a very smooth surface (like a glass table or tile).", "Open the pop-top; as air escapes under the CD, it creates a lift that lets it glide frictionlessly."],
        learningOutcomes: ["Air Pressure", "Friction", "Newtons Second Law"],
        difficulty: 'Easy',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1542831371-d531d36971e6',
        status: 'approved',
        createdBy: '550e8400-e29b-41d4-a716-446655440002'
    },
    {
        title: 'Solar Pizza Box Oven',
        description: 'A functional oven that cooks using only sunlight. It demonstrates the Greenhouse Effect, reflection, and thermal insulation.',
        budget: 50,
        classLevel: '6-8',
        subject: 'Physics',
        materials: ["Pizza box", "Aluminum foil", "Black construction paper", "Plastic wrap", "Clear tape", "Wooden skewer"],
        steps: ["Cut a flap in the lid of the pizza box, leaving one edge attached.", "Line the inside of the flap with aluminum foil to reflect sunlight.", "Line the bottom of the box with black paper to absorb heat.", "Tape plastic wrap over the opening in the lid to create an airtight window.", "Use a skewer to prop the flap open at an angle to reflect sun into the box."],
        learningOutcomes: ["Greenhouse Effect", "Heat Transfer", "Solar Energy"],
        difficulty: 'Medium',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1629088667623-01311029e000?q=80&w=2670&auto=format&fit=crop',
        status: 'approved',
        createdBy: '550e8400-e29b-41d4-a716-446655440002'
    },
    {
        title: 'Shoebox Periscope',
        description: 'An optical instrument used to see objects over or around obstacles. It demonstrates how light reflects off plane mirrors at 45-degree angles.',
        budget: 40,
        classLevel: '6-8',
        subject: 'Physics',
        materials: ["Long cardboard box (like a tall cracker or shoebox)", "Two small rectangular mirrors", "Scissors", "Tape"],
        steps: ["Cut a square window at the top left and bottom right of the long box.", "Glue the first mirror inside the top window at exactly a 45-degree angle.", "Glue the second mirror inside the bottom window, also at a 45-degree angle, facing the first mirror.", "Ensure the mirrors are parallel to each other.", "Look through the bottom window to see what is visible above the top window."],
        learningOutcomes: ["Reflection of Light", "Optics", "Angles"],
        difficulty: 'Easy',
        rating: 4.3,
        image: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d',
        status: 'approved',
        createdBy: '550e8400-e29b-41d4-a716-446655440002'
    },
    {
        title: 'Simple Homopolar Motor',
        description: 'The simplest electric motor possible. It uses the Lorentz Force to create motion from electricity and magnetism.',
        budget: 100,
        classLevel: '6-8',
        subject: 'Physics',
        materials: ["1 AA Battery", "Neodymium magnet (circular)", "Thick copper wire", "Pliers"],
        steps: ["Place the neodymium magnet on the negative (flat) end of the AA battery.", "Stand the battery upright on the magnet.", "Bend the copper wire into a shape (like a heart or a spiral) so the center touches the top positive terminal.", "Ensure the bottom ends of the wire lightly touch the sides of the magnet.", "Once the circuit is closed, the wire will start spinning rapidly around the battery."],
        learningOutcomes: ["Electromagnetism", "Lorentz Force", "Circuits"],
        difficulty: 'Medium',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e',
        status: 'approved',
        createdBy: '550e8400-e29b-41d4-a716-446655440002'
    },
    {
        title: 'Rubber Band Helicopter',
        description: 'A flying toy that demonstrates potential and kinetic energy. Winding the rubber band stores elastic potential energy that converts into mechanical lift.',
        budget: 30,
        classLevel: '6-8',
        subject: 'Physics',
        materials: ["Cardboard", "Heavy-duty rubber band", "Paperclip", "Plastic propeller (recycled from a toy)", "Wooden skewer", "Tape"],
        steps: ["Cut a small rectangular frame from cardboard to act as the body.", "Attach a plastic propeller to the top of a wooden skewer.", "Bend a paperclip into a hook and attach it to the bottom of the skewer.", "Loop a rubber band between the paperclip hook and the bottom of the cardboard frame.", "Wind the propeller to twist the rubber band tightly.", "Release the propeller and watch it fly as the band untwists."],
        learningOutcomes: ["Potential Energy", "Kinetic Energy", "Aerodynamics"],
        difficulty: 'Medium',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1563214539-756ef1986427?q=80&w=2753&auto=format&fit=crop',
        status: 'approved',
        createdBy: '550e8400-e29b-41d4-a716-446655440002'
    },
    {
        title: 'Newspaper Bridge',
        description: 'A structural challenge where students build a bridge from paper to learn about tension, compression, and truss designs.',
        budget: 10,
        classLevel: '6-8',
        subject: 'Physics',
        materials: ["Old newspapers", "Adhesive tape", "Scissors", "Ruler"],
        steps: ["Roll individual newspaper sheets tightly into thin, solid tubes and secure with tape.", "Create triangles by taping three tubes together (triangles are the strongest shape).", "Build two main side supports (trusses) using these triangles.", "Connect the two side trusses with horizontal cross-beams.", "Place a flat piece of cardboard on top to create the road deck.", "Test the weight capacity by adding small stones or coins in the center."],
        learningOutcomes: ["Structural Engineering", "Tension and Compression", "Force Distribution"],
        difficulty: 'Easy',
        rating: 4.4,
        image: 'https://images.unsplash.com/photo-1506424482853-bb0902494e75?q=80&w=2938&auto=format&fit=crop',
        status: 'approved',
        createdBy: '550e8400-e29b-41d4-a716-446655440002'
    },
    {
        title: 'Cardboard Catapult',
        description: 'A machine that uses elasticity to launch projectiles, teaching students about force, leverage, and parabolic motion.',
        budget: 20,
        classLevel: '6-8',
        subject: 'Physics',
        materials: ["Cardboard", "Rubber bands", "Plastic bottle cap", "Wooden skewers", "Glue gun"],
        steps: ["Build a rectangular base using thick cardboard strips.", "Glue two triangular cardboard pieces vertically on the base to hold the pivot.", "Push a skewer through the triangles to act as a pivot axis.", "Attach a long cardboard arm to the skewer.", "Loop a rubber band from the front of the base to the arm for tension.", "Glue a bottle cap to the end of the arm, load a paper ball, and launch!"],
        learningOutcomes: ["Projectile Motion", "Elasticity", "Simple Machines"],
        difficulty: 'Easy',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1516743618174-8aa47b6a4a11?q=80&w=2787&auto=format&fit=crop',
        status: 'approved',
        createdBy: '550e8400-e29b-41d4-a716-446655440002'
    },
    {
        title: 'Plastic Bottle Water Rocket',
        description: 'A high-pressure rocket that uses water as a propellant to demonstrate Newtons Third Law (Action-Reaction).',
        budget: 50,
        classLevel: '6-8',
        subject: 'Physics',
        materials: ["2L Plastic bottle", "Cork", "Bicycle pump", "Ball needle adapter", "Cardboard (for fins)"],
        steps: ["Tape three cardboard fins to the neck of the bottle so it can stand upright.", "Fill the bottle 1/3 full with water.", "Push a bicycle pump needle through a cork.", "Fit the cork tightly into the bottle mouth.", "Turn the rocket over (fins down), pump air until the pressure forces the cork out, launching the rocket."],
        learningOutcomes: ["Newtons Laws", "Pressure", "Aerodynamics"],
        difficulty: 'Hard',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1517976487492-5750f3195933',
        status: 'approved',
        createdBy: '550e8400-e29b-41d4-a716-446655440002'
    },
    {
        title: 'Water Filtration System',
        description: 'A multi-layered filter that cleans water through physical filtration, demonstrating porosity and gravity.',
        budget: 30,
        classLevel: '6-8',
        subject: 'Physics',
        materials: ["Plastic bottle", "Cotton balls", "Fine sand", "Gravel", "Small stones", "Muddy water"],
        steps: ["Cut the bottom off a plastic bottle and flip it upside down (cap facing down).", "Place cotton balls near the neck first.", "Add a thick layer of fine sand, followed by gravel, and finally small stones.", "Pour muddy water into the top.", "Observe the clear water dripping out from the cap into a collection cup."],
        learningOutcomes: ["Filtration", "Environmental Science", "States of Matter"],
        difficulty: 'Easy',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1527377598539-4d64826b653c?q=80&w=2890&auto=format&fit=crop',
        status: 'approved',
        createdBy: '550e8400-e29b-41d4-a716-446655440002'
    },
    {
        title: 'Shoebox Projector',
        description: 'Uses a convex lens to project smartphone images onto a wall, teaching students about focal length and image inversion.',
        budget: 150,
        classLevel: '6-8',
        subject: 'Physics',
        materials: ["Shoebox", "Magnifying glass", "Black paint", "Smartphone", "Tape"],
        steps: ["Paint the inside of the shoebox black to absorb stray light.", "Cut a circular hole at one end and tape the magnifying glass over it.", "Place your smartphone inside the box, facing the lens.", "Maximize phone brightness and turn off auto-rotate.", "Move the phone back and forth inside the box until the projection on the wall is sharp."],
        learningOutcomes: ["Optics", "Lenses", "Light"],
        difficulty: 'Medium',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1584905066893-7d5c142dd652?q=80&w=2891&auto=format&fit=crop',
        status: 'approved',
        createdBy: '550e8400-e29b-41d4-a716-446655440002'
    },
    {
        title: 'Sound Wave Visualizer',
        description: 'A device that uses a laser to show the physical vibrations of sound waves.',
        budget: 100,
        classLevel: '6-8',
        subject: 'Physics',
        materials: ["Tin can", "Balloon", "Small mirror piece", "Laser pointer", "Tape"],
        steps: ["Cut both ends off a tin can.", "Stretch a balloon tightly over one end and secure with tape.", "Glue a tiny mirror shard to the center of the balloon membrane.", "Shine a laser pointer at the mirror so it reflects onto a wall.", "Sing or shout into the open end of the can; the laser will draw patterns on the wall reflecting the sounds frequency."],
        learningOutcomes: ["Sound Waves", "Vibrations", "Frequency"],
        difficulty: 'Medium',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5',
        status: 'approved',
        createdBy: '550e8400-e29b-41d4-a716-446655440002'
    },
    {
        title: 'Homemade Compass',
        description: 'Teaches students about Earths magnetic field by magnetizing a simple needle.',
        budget: 10,
        classLevel: '6-8',
        subject: 'Physics',
        materials: ["Sewing needle", "Magnet", "Cork slice", "Bowl of water"],
        steps: ["Stroke a needle with a magnet 50 times in the same direction to magnetize it.", "Push the needle through a small, light slice of cork.", "Place the cork in a bowl of water so it floats freely.", "The needle will automatically rotate to point North-South."],
        learningOutcomes: ["Magnetism", "Earth Science", "Navigation"],
        difficulty: 'Easy',
        rating: 4.2,
        image: 'https://images.unsplash.com/photo-1574888764132-7a7167a51bb3?q=80&w=2541&auto=format&fit=crop',
        status: 'approved',
        createdBy: '550e8400-e29b-41d4-a716-446655440002'
    }
];

async function seed() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB');
        await sequelize.sync(); // Ensure tables exist

        console.log('🌱 Seeding projects...');

        for (const project of projects) {
            // Check if exists
            const exists = await Project.findOne({ where: { title: project.title } });
            if (!exists) {
                await Project.create(project);
                console.log(`✅ Added: ${project.title}`);
            } else {
                console.log(`⏭️ Skipped: ${project.title} (Already exists)`);
            }
        }

        console.log('✨ All done!');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
    } finally {
        process.exit();
    }
}

seed();
