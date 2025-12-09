-- Sample Ground Listings for Football Reservation System
-- Run this in Supabase SQL Editor to add pre-verified grounds

-- Insert sample grounds (using correct column names with quotes)
INSERT INTO grounds (
    "groundName",
    location,
    city,
    "groundType",
    "pricePerHour",
    "ownerName",
    "ownerEmail",
    "ownerPhone",
    facilities,
    status,
    rating
) VALUES
-- Islamabad Grounds
(
    'Islamabad Club - Futsal Arena',
    'F-7 Markaz',
    'Islamabad',
    'Futsal',
    5000,
    'Ahmed Khan',
    'ahmed.khan@islamabadclub.com',
    '03001234567',
    ARRAY['Floodlights', 'Parking', 'Changing Rooms', 'Cafeteria'],
    'verified',
    4.5
),
(
    'Capital Sports Complex',
    'F-10 Markaz',
    'Islamabad',
    '7-a-side',
    7000,
    'Hassan Ali',
    'info@capitalsports.pk',
    '03119876543',
    ARRAY['Floodlights', 'Parking', 'Shower Facilities', 'First Aid'],
    'verified',
    4.7
),
(
    'Blue Area Football Ground',
    'Blue Area, Jinnah Avenue',
    'Islamabad',
    '11-a-side',
    12000,
    'Bilal Ahmed',
    'bilal@bluearena.com',
    '03215551234',
    ARRAY['Floodlights', 'VIP Lounge', 'Parking', 'Changing Rooms'],
    'verified',
    4.8
),
(
    'I-14 Community Ground',
    'I-14 Sector',
    'Islamabad',
    '5-a-side',
    4000,
    'Usman Tariq',
    'usman@i14ground.pk',
    '03334445566',
    ARRAY['Floodlights', 'Parking'],
    'verified',
    4.2
),

-- Rawalpindi Grounds
(
    'Rawalpindi Sports Arena',
    'Saddar',
    'Rawalpindi',
    'Futsal',
    4500,
    'Kamran Shah',
    'kamran@rwpsports.com',
    '03451112233',
    ARRAY['Floodlights', 'Parking', 'Changing Rooms'],
    'verified',
    4.4
),
(
    'Bahria Town Football Complex',
    'Bahria Town Phase 4',
    'Rawalpindi',
    '7-a-side',
    8000,
    'Faisal Mahmood',
    'faisal@bahriafc.pk',
    '03009998877',
    ARRAY['Floodlights', 'Parking', 'Cafeteria', 'Shower Facilities'],
    'verified',
    4.9
),
(
    'Satellite Town Ground',
    'Satellite Town',
    'Rawalpindi',
    '11-a-side',
    10000,
    'Rizwan Ahmed',
    'rizwan@satelliteground.com',
    '03127778899',
    ARRAY['Floodlights', 'Parking', 'Changing Rooms'],
    'verified',
    4.3
),

-- Lahore Grounds
(
    'DHA Sports Complex Lahore',
    'DHA Phase 5',
    'Lahore',
    'Futsal',
    6000,
    'Shahid Afridi',
    'shahid@dhasports.pk',
    '03214445566',
    ARRAY['Floodlights', 'VIP Lounge', 'Parking', 'Cafeteria', 'Changing Rooms'],
    'verified',
    4.9
),
(
    'Gulberg Football Arena',
    'Gulberg III',
    'Lahore',
    '7-a-side',
    7500,
    'Imran Khan',
    'imran@gulbergfc.com',
    '03336667788',
    ARRAY['Floodlights', 'Parking', 'Shower Facilities'],
    'verified',
    4.6
),
(
    'Johar Town Sports Ground',
    'Johar Town',
    'Lahore',
    '5-a-side',
    5000,
    'Ali Raza',
    'ali@joharground.pk',
    '03008889900',
    ARRAY['Floodlights', 'Parking'],
    'verified',
    4.4
),
(
    'Model Town Football Club',
    'Model Town',
    'Lahore',
    '11-a-side',
    15000,
    'Wasim Akram',
    'wasim@modeltownfc.com',
    '03451234567',
    ARRAY['Floodlights', 'VIP Lounge', 'Parking', 'Cafeteria', 'Changing Rooms', 'Medical Room'],
    'verified',
    4.8
),

-- Karachi Grounds
(
    'Clifton Sports Arena',
    'Clifton Block 5',
    'Karachi',
    'Futsal',
    5500,
    'Asad Malik',
    'asad@cliftonsports.pk',
    '03212223344',
    ARRAY['Floodlights', 'Parking', 'Cafeteria'],
    'verified',
    4.5
),
(
    'DHA Karachi Football Ground',
    'DHA Phase 6',
    'Karachi',
    '7-a-side',
    8500,
    'Hamza Sheikh',
    'hamza@dhakarachi.com',
    '03118889977',
    ARRAY['Floodlights', 'Parking', 'Changing Rooms', 'Cafeteria'],
    'verified',
    4.7
),
(
    'Gulshan-e-Iqbal Ground',
    'Gulshan-e-Iqbal Block 13',
    'Karachi',
    '11-a-side',
    12000,
    'Fahad Ahmed',
    'fahad@gulshanground.pk',
    '03009876543',
    ARRAY['Floodlights', 'Parking', 'Changing Rooms'],
    'verified',
    4.6
),
(
    'Bahria Town Karachi Arena',
    'Bahria Town',
    'Karachi',
    'Futsal',
    6500,
    'Zain Abbas',
    'zain@bahriakhi.com',
    '03335554433',
    ARRAY['Floodlights', 'VIP Lounge', 'Parking', 'Cafeteria'],
    'verified',
    4.8
),

-- Faisalabad Grounds
(
    'Faisalabad Sports Complex',
    'Peoples Colony',
    'Faisalabad',
    '7-a-side',
    6000,
    'Nadeem Malik',
    'nadeem@fsdcomplex.pk',
    '03117778899',
    ARRAY['Floodlights', 'Parking', 'Changing Rooms'],
    'verified',
    4.3
),
(
    'Lyallpur Football Ground',
    'Civil Lines',
    'Faisalabad',
    '11-a-side',
    10000,
    'Tariq Jameel',
    'tariq@lyallpurfc.com',
    '03008887766',
    ARRAY['Floodlights', 'Parking', 'Cafeteria'],
    'verified',
    4.5
),

-- Multan Grounds
(
    'Multan Cricket Stadium - Football Arena',
    'Vehari Road',
    'Multan',
    'Futsal',
    4500,
    'Shoaib Malik',
    'shoaib@multanstadium.pk',
    '03214443322',
    ARRAY['Floodlights', 'Parking', 'Changing Rooms', 'Cafeteria'],
    'verified',
    4.6
),
(
    'Cantt Football Ground Multan',
    'Multan Cantt',
    'Multan',
    '7-a-side',
    7000,
    'Waqar Younis',
    'waqar@canttground.com',
    '03336665544',
    ARRAY['Floodlights', 'Parking'],
    'verified',
    4.4
),

-- Peshawar Grounds
(
    'Peshawar Sports Arena',
    'Hayatabad Phase 1',
    'Peshawar',
    'Futsal',
    4000,
    'Shaheen Afridi',
    'shaheen@peshawarsports.pk',
    '03009998866',
    ARRAY['Floodlights', 'Parking', 'Cafeteria'],
    'verified',
    4.5
),
(
    'University Town Ground',
    'University Town',
    'Peshawar',
    '7-a-side',
    6500,
    'Babar Azam',
    'babar@unitownground.com',
    '03127776655',
    ARRAY['Floodlights', 'Parking', 'Changing Rooms'],
    'verified',
    4.7
);

-- Verify the insertion
SELECT COUNT(*) as total_grounds FROM grounds WHERE status = 'verified';
