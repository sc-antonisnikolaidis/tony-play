import { fetchGraphQL } from '../../../api';
import {
  Session,
  SessionResult,
  SessionsByDayResponse,
  SessionsByRoomResponse,
} from '../../../interfaces/session';
import { TimeslotResult } from '../../../interfaces/timeslot';
import { DayResult } from '../../../interfaces/day';
import { Room } from '../../../interfaces/room';

const formattedSession = function (
  sessionResult: SessionResult,
  day: DayResult | null,
  time: TimeslotResult | null,
  room: Room | null,
  includeSpeakers: boolean
) {
  const session = {} as Session;
  session.id = sessionResult.id;
  session.name = sessionResult.name;

  const asset = sessionResult.sessionToMasterAsset.results[0]?.assetToPublicLink.results[0];
  const relativeUrl = asset?.relativeUrl;
  const versionHash = asset?.versionHash;

  session.type =
    sessionResult.sessionsTypeToSessions && sessionResult.sessionsTypeToSessions.taxonomyName;
  session.isPremium = sessionResult.isPremium;
  session.image = `${relativeUrl}?v=${versionHash}`;

  if (includeSpeakers && sessionResult.speakers.results.length > 0) {
    session.speaker = sessionResult.speakers.results[0].name;
    if (sessionResult.speakers.results.length > 1) {
      session.speaker = sessionResult.speakers.results
        .map((speaker) => {
          return speaker.name;
        })
        .slice(0, 2)
        .join(', ');
    }
  }

  //Not taking session with multiple rooms into consideration
  if (room != null) {
    session.roomId = room.id;
    session.room = room.name;
  } else if (sessionResult?.room) {
    session.roomId = sessionResult.room.id;
    session.room = sessionResult.room.name;
  }

  if (day != null) {
    session.Day = day.taxonomyName;
    session.ShortDay = day.sortOrder;
  } else if (sessionResult?.dayToSession) {
    session.ShortDay = sessionResult.dayToSession.sortOrder;
    session.Day = sessionResult.dayToSession.taxonomyName;
  }

  if (time != null) {
    session.timeslot = time.taxonomyLabel['en-US'];
    session.sortOrder = time.sortOrder;
  } else if (sessionResult?.timeslotToSession?.results?.length > 0) {
    session.timeslot = sessionResult.timeslotToSession.results[0].taxonomyLabel['en-US'];
    session.sortOrder = sessionResult.timeslotToSession.results[0]?.sortOrder;
  }

  return session;
};

export const getSessionsByRoom = async (
  room: string,
  day: number
): Promise<{ sessions: Session[]; room: Room }> => {
  const SessionByRoomQuery = `
  query {
    allDemo_Room(where: { id_eq: "${room}" }) {
      results {
        id
        name
        venue: rooms {
          name
        }
        session: session_Room {
          results {
            ... on M_Content_Session {
              id
              name:session_Name
              isPremium:session_PremiumSession
              sessionToMasterAsset: cmpContentToMasterLinkedAsset {
                results {
                  assetToPublicLink(first: 1) {
                    results {
                      relativeUrl
                      versionHash
                    }
                  }
                }
              }
              dayToSession: session_Days {
                taxonomyName
                sortOrder
              }
              timeslotToSession:session_Timeslot {
                results {
                  taxonomyLabel
                  sortOrder
                }
              }
              sessionsTypeToSessions: session_SessionType {
                taxonomyName
              }
              speakers: reference_Session_Speakers_Parents {
                results {
                  ... on M_Content_Speaker {
                    name:speaker_Name
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  `;

  const results: SessionsByRoomResponse = (await fetchGraphQL(
    SessionByRoomQuery
  )) as SessionsByRoomResponse;
  const currentRoom: Room = {
    id: results?.data?.allDemo_Room.results[0].id,
    name: results?.data?.allDemo_Room.results[0].name,
    venue: results?.data?.allDemo_Room.results[0].venue,
  };

  const currentDay: DayResult = {
    taxonomyName: 'Day ' + (day + 1).toString(),
    sortOrder: day.toString(),
  };

  const sessions: Session[] = [];
  results?.data?.allDemo_Room.results[0].session.results.map((sessionData) => {
    sessionData.timeslotToSession.results.map((ts) => {
      if (sessionData.dayToSession && sessionData.dayToSession.sortOrder == day.toString()) {
        sessions.push(formattedSession(sessionData, currentDay, ts, currentRoom, true));
      }
    });
  });

  return {
    sessions: sessions.sort((a, b) => a.sortOrder - b.sortOrder),
    room: currentRoom,
  };
};

export const getSessionsByDay = async (day: number): Promise<{ sessions: Session[] }> => {
  const sessionsByDayQuery = `
  query {
    allDemo_Day(where: { sortOrder_eq: ${day} }) {
      results {
        sortOrder
        taxonomyName
        dayToSession:session_Days {
          results {
            ... on M_Content_Session {
              id
              name:session_Name
              isPremium:session_PremiumSession
              sessionToMasterAsset: cmpContentToMasterLinkedAsset {
                results {
                  assetToPublicLink(first: 1) {
                    results {
                      id
                      relativeUrl
                      versionHash
                    }
                  }
                }
              }
              room: session_Room{
                id
                name
              }
              timeslotToSession: session_Timeslot{
                results{
                  taxonomyLabel
                  sortOrder
                }
              }
              sessionsTypeToSessions:session_SessionType{
                taxonomyName
              }
              speakers:reference_Session_Speakers_Parents{
                results{
                  ... on M_Content_Speaker {
                    name:speaker_Name
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  `;

  const results: SessionsByDayResponse = (await fetchGraphQL(
    sessionsByDayQuery
  )) as SessionsByDayResponse;

  const currentDay: DayResult = {
    sortOrder: results?.data?.allDemo_Day.results[0].sortOrder,
    taxonomyName: results?.data?.allDemo_Day.results[0].taxonomyName,
  };

  const sessions: Session[] = [];
  results?.data?.allDemo_Day.results[0].dayToSession.results.map((sessionData) => {
    sessionData.timeslotToSession.results.map((ts) => {
      sessions.push(formattedSession(sessionData, currentDay, ts, null, false));
    });
  });

  return { sessions: sessions.sort((a, b) => a.sortOrder - b.sortOrder) };
};
