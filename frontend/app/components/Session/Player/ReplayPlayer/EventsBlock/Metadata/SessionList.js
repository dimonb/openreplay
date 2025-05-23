import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from 'App/mstore';
import { NoContent, Icon, Loader } from 'UI';
import Session from 'Types/session';
import SessionItem from 'Shared/SessionItem';
import AnimatedSVG, { ICONS } from 'Shared/AnimatedSVG/AnimatedSVG';
import stl from './sessionList.module.css';
import { useTranslation } from 'react-i18next';

function SessionList(props) {
  const { t } = useTranslation();
  const { sessionStore } = useStore();
  const currentSessionId = sessionStore.current.sessionId;
  const { similarSessions, loading } = props;

  const similarSessionWithoutCurrent = similarSessions
    .map(({ sessions, ...rest }) => ({
      ...rest,
      sessions: sessions
        .map((s) => new Session(s))
        .filter(({ sessionId }) => sessionId !== currentSessionId),
    }))
    .filter((site) => site.sessions.length > 0);

  return (
    <Loader loading={loading}>
      <NoContent
        show={
          !loading &&
          (similarSessionWithoutCurrent.length === 0 ||
            similarSessionWithoutCurrent.size === 0)
        }
        title={
          <div className="flex items-center justify-center flex-col">
            <AnimatedSVG name={ICONS.NO_SESSIONS} size={60} />
            <div className="mt-2" />
            <div className="text-center text-gray-600">
              {t('No sessions found')}
            </div>
          </div>
        }
      >
        <div className={stl.sessionList}>
          {similarSessionWithoutCurrent.map((site) => (
            <div className={stl.siteWrapper} key={site.host}>
              <div className={stl.siteHeader}>
                <Icon
                  name="window"
                  size="14"
                  color="gray-medium"
                  marginRight="10"
                />
                <span>{site.name}</span>
              </div>
              <div className="bg-white p-3 rounded border">
                {site.sessions.map((session) => (
                  <div className="border-b last:border-none">
                    <SessionItem key={session.sessionId} session={session} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </NoContent>
    </Loader>
  );
}

export default SessionList;
