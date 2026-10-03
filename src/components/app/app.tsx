import { AppHeader } from '@components';
import { ConstructorPage } from '@pages';
import { getUserThunk } from '@slices/userSlice';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';

import { useDispatch, useSelector } from '@services/store';

import { Feed } from '../../pages/feed';
import { ForgotPassword } from '../../pages/forgot-password';
import { Login } from '../../pages/login';
import { NotFound404 } from '../../pages/not-fount-404';
import { Profile } from '../../pages/profile';
import { ProfileOrders } from '../../pages/profile-orders';
import { Register } from '../../pages/register';
import { ResetPassword } from '../../pages/reset-password';
import { getIngredientsThunk } from '../../services/slices/ingredientsSlice';
import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { Modal } from '../modal';
import { OrderInfo } from '../order-info/order-info';
import { ProtectedRoute } from '../ProtectedRoute';

import type { AppContentProps } from './type';
import type { Location } from 'react-router-dom';

import '../../index.css';

import styles from './app.module.css';

type TLocationState = {
  background?: Location;
};

const App = (): React.JSX.Element => {
  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const isIngredientsLoading = useSelector((state) => state.ingredients.isLoading);
  const ingredientsError = useSelector((state) => state.ingredients.error);

  const dispatch = useDispatch();

  useEffect(() => {
    void dispatch(getUserThunk());
  }, [dispatch]);

  useEffect(() => {
    void dispatch(getIngredientsThunk());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent
        ingredients={ingredients}
        isLoading={isIngredientsLoading}
        error={ingredientsError}
      />
    </div>
  );
};

export default App;

/* Маршруты показываются только когда ингредиенты загружены: без них не
   отрисовать ни конструктор, ни состав заказа. */
const AppContent = ({
  ingredients,
  isLoading,
  error,
}: AppContentProps): React.JSX.Element => {
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты
        {error.message ? `: ${error.message}` : '.'}
      </p>
    );
  }

  if (!ingredients.length) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>Нет ингредиентов</p>
    );
  }

  return <RouteComponent />;
};
const OrderModal = ({ onClose }: { onClose: () => void }): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();

  return (
    <Modal onClose={onClose} title={number ?? ''}>
      <OrderInfo />
    </Modal>
  );
};

const RouteComponent = (): React.JSX.Element => {
  const location = useLocation();

  const locationState = location.state as TLocationState | null;
  const background = locationState?.background;

  const navigate = useNavigate();
  const onClose = (): void => {
    void navigate(-1);
  };

  return (
    <>
      <Routes location={background ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />

        <Route path="/feed/:number" element={<OrderInfo />} />

        <Route path="/ingredients/:id" element={<IngredientDetails />} />
        <Route element={<ProtectedRoute onlyUnAuth />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/orders" element={<ProfileOrders />} />
          <Route path="/profile/orders/:number" element={<OrderInfo />} />
        </Route>

        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route path="/feed/:number" element={<OrderModal onClose={onClose} />} />

          <Route
            path="/ingredients/:id"
            element={
              <Modal onClose={onClose} title="Детали ингредиента">
                <IngredientDetails />
              </Modal>
            }
          />

          <Route element={<ProtectedRoute />}>
            <Route
              path="/profile/orders/:number"
              element={<OrderModal onClose={onClose} />}
            />
          </Route>
        </Routes>
      )}
    </>
  );
};
