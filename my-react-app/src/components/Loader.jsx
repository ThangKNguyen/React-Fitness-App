import { Stack } from '@mui/material';
import { InfinitySpin } from 'react-loader-spinner';

export default function Loader() {
  return (
    <Stack direction="row" justifyContent="center" alignItems="center" width="100%" py="40px">
      <InfinitySpin color="#FF2625" />
    </Stack>
  );
}
