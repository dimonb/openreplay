import React from 'react';
import { PlayerContext } from 'App/components/Session/playerContext';
import { observer } from 'mobx-react-lite';
import { ProgressBar } from 'App/player-ui';

function TimeTracker({ scale, live = false, left }) {
  const { store } = React.useContext(PlayerContext);
  const { time } = store.get();

  return <ProgressBar scale={scale} live={live} left={left} time={time} />;
}

TimeTracker.displayName = 'TimeTracker';

export default observer(TimeTracker);
