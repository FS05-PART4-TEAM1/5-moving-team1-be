const env = 'ENV';
const dbType = 'DB_TYPE';
const dbHost = 'DB_HOST';
const dbPort = 'DB_PORT';
const dbUsername = 'DB_USERNAME';
const dbPassword = 'DB_PASSWORD';
const dbDatabase = 'DB_DATABASE';
const dbSynchronize = 'DB_SYNCHRONIZE';
const hashRounds = 'HASH_ROUNDS';
const accessToken = 'ACCESS_TOKEN_SECRET';
const refreshToken = 'REFRESH_TOKEN_SECRET';
// 토큰 만료 시간 관련 키 추가
const accessTokenExpirationDev = 'ACCESS_TOKEN_EXPIRATION_DEV';
const accessTokenExpirationProd = 'ACCESS_TOKEN_EXPIRATION_PROD';
const refreshTokenExpirationDev = 'REFRESH_TOKEN_EXPIRATION_DEV';
const refreshTokenExpirationProd = 'REFRESH_TOKEN_EXPIRATION_PROD';

// naver 관련 키 추가
const naverClientId = 'NAVER_CLIENT_ID';
const naverClientSecret = 'NAVER_CLIENT_SECRET';

export const envVariableKeys = {
  env,
  dbType,
  dbHost,
  dbPort,
  dbUsername,
  dbPassword,
  dbDatabase,
  dbSynchronize,
  hashRounds,
  accessToken,
  refreshToken,

  accessTokenExpirationDev,
  accessTokenExpirationProd,
  refreshTokenExpirationDev,
  refreshTokenExpirationProd,

  naverClientId,
  naverClientSecret,
};
