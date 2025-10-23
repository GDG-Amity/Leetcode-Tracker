

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const LEETCODE_API_ENDPOINT = 'https://leetcode-stats.tashif.codes/';
const WEEKLY_TARGET = 10;

const completedList = document.getElementById('completed-list');
const inProgressList = document.getElementById('in-progress-list');
const loader = document.getElementById('loader');
const refreshBtn = document.getElementById('refresh-btn');



function getStartOfWeekUTC() {
    const now = new Date();
    const dayOfWeek = now.getUTCDay();
    const date = new Date(now.valueOf());
    date.setUTCDate(now.getUTCDate() - dayOfWeek);
    date.setUTCHours(0, 0, 0, 0);
    return Math.floor(date.getTime() / 1000);
}

function createActivityHTML(submissionCalendar) {
    let activityHTML = '';
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const startOfWeekUTC = getStartOfWeekUTC();
    for (let i = 0; i < 7; i++) {
        const dayTimestampUTC = startOfWeekUTC + (i * 24 * 60 * 60);
        const isActive = submissionCalendar && submissionCalendar[dayTimestampUTC];
        activityHTML += `
            <li class="day">
                ${dayNames[i]}
                <div class="dot ${isActive ? 'active' : ''}"></div>
            </li>
        `;
    }
    return `<ul class="weekly-activity">${activityHTML}</ul>`;
}

async function fetchUserData(username) {
    if (!username) {
        console.error("Username is undefined. Skipping API call.");
        return null;
    }
    try {
        const response = await fetch(`${LEETCODE_API_ENDPOINT}${username}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error(`Network error for ${username}:`, error);
        return null;
    }
}


function createMemberCard(memberData) {
    const { name, username, weeklySolvedCount, totalSolved, submissionCalendar } = memberData;
    const isCompleted = weeklySolvedCount >= WEEKLY_TARGET;
    const cardClass = isCompleted ? 'completed' : 'in-progress';
    const progressText = `${weeklySolvedCount} / ${WEEKLY_TARGET}`;
    const activityDotsHTML = createActivityHTML(submissionCalendar);
    const profileUrl = `https://leetcode.com/${username}/`;

    return `
        <div class="member-card ${cardClass}">
            <div class="card-header">
                <a href="${profileUrl}" target="_blank" rel="noopener noreferrer" class="profile-link">
                    <h3>${name}</h3>
                </a>
                <span>${progressText}</span>
            </div>
            ${activityDotsHTML} 
            <p class="total-solved">Total Solved: ${totalSolved || 0}</p>
        </div>
    `;
}


async function main() {
    loader.style.display = 'block';
    completedList.innerHTML = '';
    inProgressList.innerHTML = '';
    
    const startOfWeekTimestamp = getStartOfWeekUTC();
    const membersCollection = await db.collection('members').get();

    for (const doc of membersCollection.docs) {
        const member = doc.data();
        const username = member['leetcode-username']; 
        const userData = await fetchUserData(username);

        if (!userData || userData.status !== 'success') {
            console.log(`Could not retrieve data for ${member.name}`);
            continue;
        }

        let weeklySolvedCount = 0;
        const submissionCalendar = userData.submissionCalendar;
        if (submissionCalendar) {
            for (const timestamp in submissionCalendar) {
                if (parseInt(timestamp) >= startOfWeekTimestamp) {
                    weeklySolvedCount += submissionCalendar[timestamp];
                }
            }
        }
        
        const memberData = {
            name: member.name,
            username: username, 
            weeklySolvedCount: weeklySolvedCount,
            totalSolved: userData.totalSolved,
            submissionCalendar: userData.submissionCalendar
        };

        const cardHTML = createMemberCard(memberData);
        
        if (memberData.weeklySolvedCount >= WEEKLY_TARGET) {
            completedList.innerHTML += cardHTML;
        } else {
            inProgressList.innerHTML += cardHTML;
        }
    }
    loader.style.display = 'none';
}


refreshBtn.addEventListener('click', main);
document.addEventListener('DOMContentLoaded', main);