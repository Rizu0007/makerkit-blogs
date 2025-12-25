import { withI18n } from '~/lib/i18n/with-i18n';

function HomeLayout({ children }: React.PropsWithChildren) {
  return <>{children}</>;
}

export default withI18n(HomeLayout);
