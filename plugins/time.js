const {Module} = require('../lib/plugins');
const moment = require('moment-timezone');

Module({
  command: 'timezone',
  package: 'time',
  description: 'Get time info of a timezone'
})(async (message, match) => {
          try {  
            if (!args || args.length === 0) {  
              return msg.reply("Usage: .time <Continent/City>\nExample: .time Asia/Kolkata");  
            }  

            // Join with spaces first, then replace spaces with underscores  
            let tzInput = args.join(' ');  

            // If user typed something like "Asia Kolkata", convert to "Asia/Kolkata"  
            if (tzInput.includes(' ')) {  
              tzInput = tzInput.replace(' ', '/');  
            }  

            // Check if it's a valid timezone  
            if (!moment.tz.zone(tzInput)) {  
              // If not valid, try common alternatives  
              let suggestedTz = null;  

              // Common timezone mappings  
              const commonTimezones = {  
                // India region  
                'india': 'Asia/Kolkata',  
                'kolkata': 'Asia/Kolkata',  
                'mumbai': 'Asia/Kolkata',  
                'delhi': 'Asia/Kolkata',  
                'chennai': 'Asia/Kolkata',  
                'bangalore': 'Asia/Kolkata',  
                'hyderabad': 'Asia/Kolkata',  
                'pune': 'Asia/Kolkata',  
                'ahmedabad': 'Asia/Kolkata',  
                'jaipur': 'Asia/Kolkata',  
                'lucknow': 'Asia/Kolkata',  
                'kanpur': 'Asia/Kolkata',  
                'nagpur': 'Asia/Kolkata',  
                'indore': 'Asia/Kolkata',  
                'thane': 'Asia/Kolkata',  
                'bhopal': 'Asia/Kolkata',  
                'visakhapatnam': 'Asia/Kolkata',  
                'patna': 'Asia/Kolkata',  
                'vadodara': 'Asia/Kolkata',  
                'ghaziabad': 'Asia/Kolkata',  
                'ludhiana': 'Asia/Kolkata',  
                'agra': 'Asia/Kolkata',  
                'nashik': 'Asia/Kolkata',  
                'faridabad': 'Asia/Kolkata',  
                'meerut': 'Asia/Kolkata',  
                'rajkot': 'Asia/Kolkata',  
                'kalyan': 'Asia/Kolkata',  
                'varanasi': 'Asia/Kolkata',  
                'srinagar': 'Asia/Kolkata',  
                'amritsar': 'Asia/Kolkata',  
                'navimumbai': 'Asia/Kolkata',  
                'ranchi': 'Asia/Kolkata',  
                'kochi': 'Asia/Kolkata',  
                'guwahati': 'Asia/Kolkata',  
                'chandigarh': 'Asia/Kolkata',  
                'thiruvananthapuram': 'Asia/Kolkata',  
                'coimbatore': 'Asia/Kolkata',  
                'jodhpur': 'Asia/Kolkata',  
                'madurai': 'Asia/Kolkata',  
                'salem': 'Asia/Kolkata',  
                'tiruchirappalli': 'Asia/Kolkata',  
                'kota': 'Asia/Kolkata',  
                'bhubaneswar': 'Asia/Kolkata',  
                'aligarh': 'Asia/Kolkata',  
                'bareilly': 'Asia/Kolkata',  
                'moradabad': 'Asia/Kolkata',  
                'mysore': 'Asia/Kolkata',  
                'gurgaon': 'Asia/Kolkata',  
                'noida': 'Asia/Kolkata',  
                'shimla': 'Asia/Kolkata',  
                'dehradun': 'Asia/Kolkata',  

                // USA region  
                'usa': 'America/New_York',  
                'newyork': 'America/New_York',  
                'ny': 'America/New_York',  
                'nyc': 'America/New_York',  
                'losangeles': 'America/Los_Angeles',  
                'la': 'America/Los_Angeles',  
                'chicago': 'America/Chicago',  
                'houston': 'America/Chicago',  
                'phoenix': 'America/Phoenix',  
                'philadelphia': 'America/New_York',  
                'sanantonio': 'America/Chicago',  
                'sandiego': 'America/Los_Angeles',  
                'dallas': 'America/Chicago',  
                'sanfrancisco': 'America/Los_Angeles',  
                'sf': 'America/Los_Angeles',  
                'austin': 'America/Chicago',  
                'jacksonville': 'America/New_York',  
                'fortworth': 'America/Chicago',  
                'columbus': 'America/New_York',  
                'charlotte': 'America/New_York',  
                'indianapolis': 'America/New_York',  
                'seattle': 'America/Los_Angeles',  
                'denver': 'America/Denver',  
                'washington': 'America/New_York',  
                'dc': 'America/New_York',  
                'boston': 'America/New_York',  
                'elpaso': 'America/Denver',  
                'detroit': 'America/New_York',  
                'nashville': 'America/Chicago',  
                'memphis': 'America/Chicago',  
                'portland': 'America/Los_Angeles',  
                'lasvegas': 'America/Los_Angeles',  
                'lv': 'America/Los_Angeles',  
                'baltimore': 'America/New_York',  
                'milwaukee': 'America/Chicago',  
                'albuquerque': 'America/Denver',  
                'tucson': 'America/Phoenix',  
                'fresno': 'America/Los_Angeles',  
                'sacramento': 'America/Los_Angeles',  
                'kansascity': 'America/Chicago',  
                'atlanta': 'America/New_York',  
                'miami': 'America/New_York',  
                'orlando': 'America/New_York',  
                'tampa': 'America/New_York',  
                'cleveland': 'America/New_York',  
                'pittsburgh': 'America/New_York',  
                'cincinnati': 'America/New_York',  
                'minneapolis': 'America/Chicago',  
                'oklahomacity': 'America/Chicago',  
                'neworleans': 'America/Chicago',  
                'honolulu': 'Pacific/Honolulu',  
                'hawaii': 'Pacific/Honolulu',  
                'anchorage': 'America/Anchorage',  
                'alaska': 'America/Anchorage',  

                // UK/Europe  
                'london': 'Europe/London',  
                'uk': 'Europe/London',  
                'britain': 'Europe/London',  
                'england': 'Europe/London',  
                'manchester': 'Europe/London',  
                'birmingham': 'Europe/London',  
                'liverpool': 'Europe/London',  
                'leeds': 'Europe/London',  
                'glasgow': 'Europe/London',  
                'edinburgh': 'Europe/London',  
                'belfast': 'Europe/London',  
                'cardiff': 'Europe/London',  
                'paris': 'Europe/Paris',  
                'france': 'Europe/Paris',  
                'berlin': 'Europe/Berlin',  
                'germany': 'Europe/Berlin',  
                'munich': 'Europe/Berlin',  
                'hamburg': 'Europe/Berlin',  
                'frankfurt': 'Europe/Berlin',  
                'rome': 'Europe/Rome',  
                'italy': 'Europe/Rome',  
                'milan': 'Europe/Rome',  
                'venice': 'Europe/Rome',  
                'madrid': 'Europe/Madrid',  
                'spain': 'Europe/Madrid',  
                'barcelona': 'Europe/Madrid',  
                'amsterdam': 'Europe/Amsterdam',  
                'netherlands': 'Europe/Amsterdam',  
                'brussels': 'Europe/Brussels',  
                'belgium': 'Europe/Brussels',  
                'vienna': 'Europe/Vienna',  
                'austria': 'Europe/Vienna',  
                'zurich': 'Europe/Zurich',  
                'switzerland': 'Europe/Zurich',  
                'stockholm': 'Europe/Stockholm',  
                'sweden': 'Europe/Stockholm',  
                'oslo': 'Europe/Oslo',  
                'norway': 'Europe/Oslo',  
                'copenhagen': 'Europe/Copenhagen',  
                'denmark': 'Europe/Copenhagen',  
                'helsinki': 'Europe/Helsinki',  
                'finland': 'Europe/Helsinki',  
                'lisbon': 'Europe/Lisbon',  
                'portugal': 'Europe/Lisbon',  
                'athens': 'Europe/Athens',  
                'greece': 'Europe/Athens',  
                'dublin': 'Europe/Dublin',  
                'ireland': 'Europe/Dublin',  
                'warsaw': 'Europe/Warsaw',  
                'poland': 'Europe/Warsaw',  
                'prague': 'Europe/Prague',  
                'czech': 'Europe/Prague',  
                'budapest': 'Europe/Budapest',  
                'hungary': 'Europe/Budapest',  
                'moscow': 'Europe/Moscow',  
                'russia': 'Europe/Moscow',  
                'istanbul': 'Europe/Istanbul',  
                'turkey': 'Europe/Istanbul',  

                // Asia Pacific  
                'dubai': 'Asia/Dubai',  
                'uae': 'Asia/Dubai',  
                'abudhabi': 'Asia/Dubai',  
                'singapore': 'Asia/Singapore',  
                'sydney': 'Australia/Sydney',  
                'melbourne': 'Australia/Melbourne',  
                'australia': 'Australia/Sydney',  
                'perth': 'Australia/Perth',  
                'brisbane': 'Australia/Brisbane',  
                'adelaide': 'Australia/Adelaide',  
                'auckland': 'Pacific/Auckland',  
                'newzealand': 'Pacific/Auckland',  
                'tokyo': 'Asia/Tokyo',  
                'japan': 'Asia/Tokyo',  
                'osaka': 'Asia/Tokyo',  
                'kyoto': 'Asia/Tokyo',  
                'seoul': 'Asia/Seoul',  
                'korea': 'Asia/Seoul',  
                'beijing': 'Asia/Shanghai',  
                'china': 'Asia/Shanghai',  
                'shanghai': 'Asia/Shanghai',  
                'hongkong': 'Asia/Hong_Kong',  
                'taipei': 'Asia/Taipei',  
                'taiwan': 'Asia/Taipei',  
                'bangkok': 'Asia/Bangkok',  
                'thailand': 'Asia/Bangkok',  
                'kualalumpur': 'Asia/Kuala_Lumpur',  
                'malaysia': 'Asia/Kuala_Lumpur',  
                'jakarta': 'Asia/Jakarta',  
                'indonesia': 'Asia/Jakarta',  
                'manila': 'Asia/Manila',  
                'philippines': 'Asia/Manila',  
                'hanoi': 'Asia/Ho_Chi_Minh',  
                'vietnam': 'Asia/Ho_Chi_Minh',  
                'saigon': 'Asia/Ho_Chi_Minh',  
                'dhaka': 'Asia/Dhaka',  
                'bangladesh': 'Asia/Dhaka',  
                'islamabad': 'Asia/Karachi',  
                'pakistan': 'Asia/Karachi',  
                'karachi': 'Asia/Karachi',  
                'lahore': 'Asia/Karachi',  
                'colombo': 'Asia/Colombo',  
                'srilanka': 'Asia/Colombo',  
                'kathmandu': 'Asia/Kathmandu',  
                'nepal': 'Asia/Kathmandu',  

                // Middle East/Africa  
                'riyadh': 'Asia/Riyadh',  
                'saudiarabia': 'Asia/Riyadh',  
                'doha': 'Asia/Qatar',  
                'qatar': 'Asia/Qatar',  
                'kuwait': 'Asia/Kuwait',  
                'bahrain': 'Asia/Bahrain',  
                'tehran': 'Asia/Tehran',  
                'iran': 'Asia/Tehran',  
                'baghdad': 'Asia/Baghdad',  
                'iraq': 'Asia/Baghdad',  
                'cairo': 'Africa/Cairo',  
                'egypt': 'Africa/Cairo',  
                'johannesburg': 'Africa/Johannesburg',  
                'southafrica': 'Africa/Johannesburg',  
                'capetown': 'Africa/Johannesburg',  
                'nairobi': 'Africa/Nairobi',  
                'kenya': 'Africa/Nairobi',  
                'lagos': 'Africa/Lagos',  
                'nigeria': 'Africa/Lagos',  
                'accra': 'Africa/Accra',  
                'ghana': 'Africa/Accra',  

                // Canada  
                'toronto': 'America/Toronto',  
                'canada': 'America/Toronto',  
                'vancouver': 'America/Vancouver',  
                'montreal': 'America/Toronto',  
                'calgary': 'America/Edmonton',  
                'edmonton': 'America/Edmonton',  
                'ottawa': 'America/Toronto',  
                'winnipeg': 'America/Winnipeg',  
                'quebec': 'America/Toronto',  
                'halifax': 'America/Halifax',  

                // South America  
                'saopaulo': 'America/Sao_Paulo',  
                'brazil': 'America/Sao_Paulo',  
                'riodejaneiro': 'America/Sao_Paulo',  
                'buenosaires': 'America/Argentina/Buenos_Aires',  
                'argentina': 'America/Argentina/Buenos_Aires',  
                'lima': 'America/Lima',  
                'peru': 'America/Lima',  
                'bogota': 'America/Bogota',  
                'colombia': 'America/Bogota',  
                'santiago': 'America/Santiago',  
                'chile': 'America/Santiago',  
                'mexicocity': 'America/Mexico_City',  
                'mexico': 'America/Mexico_City'  
              };  

              // Check if input matches any common timezone  
              const lowerInput = tzInput.toLowerCase();  
              if (commonTimezones[lowerInput]) {  
                suggestedTz = commonTimezones[lowerInput];  
              } else {  
                // Use the closest match function as fallback  
                suggestedTz = getClosestTimezone(tzInput);  
              }  

              if (suggestedTz) {  
                const time = moment.tz(suggestedTz);
                const txt = `Here's the correct timezone you might be looking for.\nTimezone: ${suggestedTz}\nDate: ${time.format('YYYY-MM-DD')}\nTime: ${time.format('HH:mm:ss')}\nUTC Offset: ${time.format('Z')}`;
                return await msg.reply(txt);  
              } else {  
                return await msg.reply(`Invalid timezone: ${tzInput}\nUse format: Continent/City\nExample: .time Asia/Kolkata`);  
              }  
            }  

            // If we have a valid timezone  
            const time = moment.tz(tzInput);  
            const txt = `*Timezone: ${tzInput}*\n` +  
                       `Date: ${time.format('YYYY-MM-DD')}\n` +  
                       `Time: ${time.format('HH:mm:ss')}\n` +  
                       `UTC Offset: ${time.format('Z')}`;  

            await msg.reply(txt);  
          } catch (e) {  
            console.error("Time Command Error:", e);  
            await msg.reply("_Failed to fetch time info_");  
          }  
          });