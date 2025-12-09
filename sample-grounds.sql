-- Sample Ground Listings for Football Reservation System
-- Run this in Supabase SQL Editor to add pre-verified grounds
-- Now includes placeholder images!

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
    "imageUrl",
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
    'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800',
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
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
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
    'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=800',
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
    'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800',
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
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
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
    'https://images.unsplash.com/photo-1624880357913-a8539238245b?w=800',
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
    'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800',
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
    'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800',
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
    'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800',
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
    'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800',
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
    'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800',
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
    'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800',
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
    'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800',
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
    'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800',
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
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800',
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
    'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800',
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
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
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
    'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800',
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
    'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800',
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
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
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
    'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=800',
    'verified',
    4.7
);

-- Verify the insertion
SELECT COUNT(*) as total_grounds FROM grounds WHERE status = 'verified';
