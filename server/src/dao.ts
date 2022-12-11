import dayjs from 'dayjs';
import { Version2Client } from 'jira.js'

import env from './environment';

const maxResults = 1000;
const manDay = 8 * 60 * 60;

interface Worklog {
    month: String,
    worked: number,
    type: String
}

interface DaylyWorklog {
    hour: String,
    worked: number,
    type: String
}

const client = new Version2Client({
    host: env.external.jira.host,
    authentication: {
      oauth: {
        consumerKey: env.external.jira.oauth.consumerKey,
        consumerSecret: "-----BEGIN PRIVATE KEY-----\n" + `${env.external.jira.oauth.consumerSecret}\=\n` + "-----END PRIVATE KEY-----",
        accessToken: env.external.jira.oauth.accessToken,
        tokenSecret: env.external.jira.oauth.tokenSecret,
      },
    },
});

async function getJiraWorklogs(startDate: string, endDate: string, jira: string = ""): Promise<Worklog[] | DaylyWorklog[]> {
    return new Promise(async (res, _) => {
        if (jira) {
            client.projects.getProject({projectIdOrKey: jira})
                .then(async _ => {
                    let worklogs: Worklog[] = []
                    let start = 0
                    let newWorklogs = await client.issueSearch.searchForIssuesUsingJql({jql: `project=${jira} AND worklogDate >= "${startDate}" AND worklogDate <= "${endDate}"`, fields: ['components', 'worklog'], startAt: start, maxResults: maxResults})
                    while (start < Number(newWorklogs.total)) {
                        newWorklogs.issues?.filter(issue => issue.fields.worklog.worklogs.length > 0)
                            .forEach(issue => {
                                issue.fields.worklog.worklogs.forEach(worklog => {
                                    if (dayjs(worklog.started) <= dayjs(endDate) && dayjs(worklog.started) >= dayjs(startDate)) {
                                        worklogs.push({
                                            month: dayjs(worklog.started).format('MM/YYYY'),
                                            worked: Number(worklog.timeSpentSeconds)/manDay,
                                            type: String(issue.fields.components.length > 0 ? issue.fields.components.pop()?.name : 'Project')
                                        })
                                    }
                                })
                            })
                        start += maxResults
                        newWorklogs = await client.issueSearch.searchForIssuesUsingJql({jql: `project=${jira} AND worklogDate >= "${startDate}" AND worklogDate <= "${endDate}"`, fields: ['components', 'worklog'], startAt: start, maxResults: maxResults})
                    }
                    res(worklogs)
                })
                .catch(error => res(error))
        } else {
            let worklogs: DaylyWorklog[] = []
            let start = 0
            let newWorklogs = await client.issueSearch.searchForIssuesUsingJql({jql: `worklogDate >= "${startDate}" AND worklogDate <= "${endDate}"`,  fields: ['components', 'worklog'], startAt: start, maxResults: maxResults})
            while (start < Number(newWorklogs.total)) {
                newWorklogs.issues?.filter(issue => issue.fields.worklog.worklogs.length > 0)
                    .forEach(issue => {
                        issue.fields.worklog.worklogs.forEach(worklog => {
                            if (dayjs(worklog.started) <= dayjs(endDate) && dayjs(worklog.started) >= dayjs(startDate)) {
                                worklogs.push({
                                    hour: dayjs(worklog.created).format('HH:00'),
                                    worked: Number(worklog.timeSpentSeconds)/manDay,
                                    type: String(issue.fields.components.length > 0 ? issue.fields.components.pop()?.name : 'Project')
                                })
                            }
                        })
                    })
                start += maxResults
                newWorklogs = await client.issueSearch.searchForIssuesUsingJql({jql: `worklogDate >= "${startDate}" AND worklogDate <= "${endDate}"`,  fields: ['components', 'worklog'], startAt: start, maxResults: maxResults})
            }
            res(worklogs)
        }
    })
}

async function getJiraWorklogsByType(startDate: string, endDate: string, type: string, jira: string = "") {
    return new Promise(async (res, _) => {
        if (jira) {
            client.projects.getProject({projectIdOrKey: jira})
                .then(async _ => {
                    let worklogs = 0
                    let start = 0
                    let newWorklogs = await client.issueSearch.searchForIssuesUsingJql({jql: `project=${jira} AND worklogDate >= "${startDate}" AND worklogDate <= "${endDate}"`, fields: ['components', 'worklog'], startAt: start, maxResults: maxResults})
                    while (start < Number(newWorklogs.total)) {
                        newWorklogs.issues?.filter(issue => issue.fields.worklog.worklogs.length > 0)
                            .forEach(issue => {
                                issue.fields.worklog.worklogs.forEach(worklog => {
                                    if (dayjs(worklog.started) <= dayjs(endDate) && dayjs(worklog.started) >= dayjs(startDate)) {
                                        if (type !== 'Other') {
                                            if (issue.fields.components.pop()?.name?.toLocaleLowerCase().includes(type.toLocaleLowerCase()))
                                                worklogs += Number(worklog.timeSpentSeconds)/manDay
                                        } else
                                            worklogs += Number(worklog.timeSpentSeconds)/manDay
                                    }
                                })
                            })
                        start += maxResults
                        newWorklogs = await client.issueSearch.searchForIssuesUsingJql({jql: `project=${jira} AND worklogDate >= "${startDate}" AND worklogDate <= "${endDate}"`, fields: ['components', 'worklog'], startAt: start, maxResults: maxResults})
                    }
                    res(worklogs)
                })
                .catch(error => res(error))
        } else {
            let worklogs = 0
            let start = 0
            let newWorklogs = await client.issueSearch.searchForIssuesUsingJql({jql: `worklogDate >= "${startDate}" AND worklogDate <= "${endDate}"`,  fields: ['components', 'worklog'], startAt: start, maxResults: maxResults})
            while (start < Number(newWorklogs.total)) {
                newWorklogs.issues?.filter(issue => issue.fields.worklog.worklogs.length > 0)
                    .forEach(issue => {
                        issue.fields.worklog.worklogs.forEach(worklog => {
                            if (dayjs(worklog.started) <= dayjs(endDate) && dayjs(worklog.started) >= dayjs(startDate)) {
                                if (type !== 'Other') {
                                    if (issue.fields.components.pop()?.name?.toLocaleLowerCase().includes(type.toLocaleLowerCase()))
                                        worklogs += Number(worklog.timeSpentSeconds)/manDay
                                } else
                                    worklogs += Number(worklog.timeSpentSeconds)/manDay
                            }
                        })
                    })
                start += maxResults
                newWorklogs = await client.issueSearch.searchForIssuesUsingJql({jql: `worklogDate >= "${startDate}" AND worklogDate <= "${endDate}"`,  fields: ['components', 'worklog'], startAt: start, maxResults: maxResults})
            }
            res(worklogs)
        }
    })
}

export { 
    getJiraWorklogs,
    getJiraWorklogsByType,
}