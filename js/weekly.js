



firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const LEETCODE_API_ENDPOINT = 'https://leetcode-stats.tashif.codes/';

const weeklyContainer = document.getElementById('weekly-container');
const loader = document.getElementById('loader');



function getStartOfWeekUTC() {
    const now = new Date();
    const dayOfWeek = now.getUTCDay();
    const date = new Date(now.valueOf());
    date.setUTCDate(now.getUTCDate() - dayOfWeek);
    date.setUTCHours(0, 0, 0, 0);
    return Math.floor(date.getTime() / 1000);
}

async function fetchUserData(username) {
    if (!username) return null;
    try {
        const response = await fetch(`${LEETCODE_API_ENDPOINT}${username}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        return null;
    }
}



async function main() {
    const startOfWeekTimestamp = getStartOfWeekUTC();
    const members = await db.collection('members').get();

    
    const weeklyActivity = {};
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    
    for (let i = 0; i < 7; i++) {
        const dayTimestamp = startOfWeekTimestamp + (i * 24 * 60 * 60);
        const date = new Date(dayTimestamp * 1000);
        const dateString = `${dayNames[i]}, ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`;
        weeklyActivity[dateString] = [];
    }

   
    for (const doc of members.docs) {
        const member = doc.data();
        const username = member['leetcode-username'];
        const userData = await fetchUserData(username);

        if (userData && userData.submissionCalendar) {
            for (const ts in userData.submissionCalendar) {
                const timestamp = parseInt(ts);
                if (timestamp >= startOfWeekTimestamp) {
                    const date = new Date(timestamp * 1000);
                    const dayIndex = date.getUTCDay();
                    const dateString = `${dayNames[dayIndex]}, ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`;
                    
                    if (weeklyActivity[dateString]) {
                        weeklyActivity[dateString].push({
                            name: member.name,
                            count: userData.submissionCalendar[ts]
                        });
                    }
                }
            }
        }
    }

    renderData(weeklyActivity);
}

function renderData(weeklyActivity) {
    loader.style.display = 'none';
    let html = '';

    for (const dateString in weeklyActivity) {
        html += `<div class="day-card"><h2>${dateString}</h2>`;
        const activities = weeklyActivity[dateString];

        if (activities.length === 0) {
            html += `<p class="no-activity">No activity on this day.</p>`;
        } else {
            html += `<ul class="activity-list">`;
            activities.forEach(activity => {
                html += `<li><strong>${activity.name}</strong> solved ${activity.count} problem(s)</li>`;
            });
            html += `</ul>`;
        }
        html += `</div>`;
    }
    weeklyContainer.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', main);