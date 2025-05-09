import React from 'react';
import { useObserver } from 'mobx-react-lite';
import { Button } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useStore } from 'App/mstore';
import { useModal } from 'App/components/Modal';
import { dashboardMetricCreate, withSiteId } from 'App/routes';
import DashboardForm from '../DashboardForm';
import DashboardMetricSelection from '../DashboardMetricSelection';
import { useTranslation } from 'react-i18next';

interface Props extends RouteComponentProps {
  history: any;
  siteId?: string;
  dashboardId?: string;
  onMetricAdd?: () => void;
}
function DashboardModal(props: Props) {
  const { t } = useTranslation();
  const { history, siteId, dashboardId } = props;
  const { dashboardStore } = useStore();
  const selectedWidgetsCount = useObserver(
    () => dashboardStore.selectedWidgets.length,
  );
  const { hideModal } = useModal();
  const dashboard = useObserver(() => dashboardStore.dashboardInstance);
  const loading = useObserver(() => dashboardStore.isSaving);

  const onSave = () => {
    dashboardStore
      .save(dashboard)
      .then(async (syncedDashboard) => {
        if (dashboard.exists()) {
          await dashboardStore.fetch(dashboard.dashboardId);
        }
        dashboardStore.selectDashboardById(syncedDashboard.dashboardId);
        history.push(
          withSiteId(`/dashboard/${syncedDashboard.dashboardId}`, siteId),
        );
      })
      .then(hideModal);
  };

  const handleCreateNew = () => {
    const path = withSiteId(dashboardMetricCreate(dashboardId), siteId);
    props.onMetricAdd();
    history.push(path);
    hideModal();
  };
  const isDashboardExists = dashboard.exists();

  return useObserver(() => (
    <div style={{ maxWidth: '85vw' }}>
      <div
        className="border-r shadow p-4 h-screen"
        style={{
          backgroundColor: '#FAFAFA',
          zIndex: 999,
          width: '100%',
          maxWidth: '1360px',
        }}
      >
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-2xl">
              {isDashboardExists
                ? t('Add metrics to dashboard')
                : t('Create Dashboard')}
            </h1>
          </div>
          <div>
            <span className="text-md">{t('Past 7 days data')}</span>
          </div>
        </div>
        {!isDashboardExists && (
          <>
            <DashboardForm />
            <p>
              {t(
                'Create new dashboard by choosing from the range of predefined metrics that you care about. You can always add your custom metrics later.',
              )}
            </p>
          </>
        )}
        <DashboardMetricSelection
          handleCreateNew={handleCreateNew}
          isDashboardExists={isDashboardExists}
        />

        <div className="flex items-center absolute bottom-0 left-0 right-0 bg-white border-t p-3">
          <Button
            type="primary"
            disabled={!dashboard.isValid || loading}
            onClick={onSave}
            className="flaot-left mr-2"
          >
            {isDashboardExists ? t('Add Selected to Dashboard') : t('Create')}
          </Button>
          <span className="ml-2 color-gray-medium">
            {selectedWidgetsCount}&nbsp;{t('Metrics')}
          </span>
        </div>
      </div>
    </div>
  ));
}

export default withRouter(DashboardModal);
