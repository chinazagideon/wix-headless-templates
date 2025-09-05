import PlansList from '@app/components/Plan/PlanList';
import { useServerAuthSession } from '@app/hooks/useServerAuthSession';
import { safeGetPaidPlans } from '@app/model/paid-plans/paid-plans-api';
import testIds from '@app/utils/test-ids';
import PageHeader from '@app/components/Layout/PageHeader';

// Manually opt out static rendering because of https://github.com/vercel/next.js/issues/43077
export const dynamic = 'force-dynamic';

export default async function PlansPage({
  searchParams,
}: {
  searchParams?: { [_: string]: string };
}) {
  const { planIds, checkoutData } = searchParams ?? {};
  const wixSession = useServerAuthSession();
  const { data: plans } = await safeGetPaidPlans(wixSession, {
    planIds: planIds ? planIds?.split(',') : undefined,
  });

  return (
    <div className="max-w-full-content mx-auto pb-8">
      <PageHeader title="Plans & Pricing" />
      <PlansList plans={plans} checkoutData={checkoutData} />
    </div>
  );
}
