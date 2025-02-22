import { GenericErrors } from '@common/constants/error';
import { db } from '@config/db';
import { GoogleUser } from '@services/auth/types';
import { AppError } from '@common/error/appError';
import { Users } from '@services/user/models';
import { eq } from 'drizzle-orm';
import { UserErrors } from './constants/errors';

const getOrCreateUserWithGoogle = async (profile: GoogleUser) => {
  const updateObject = {
    googleId: profile.id,
    avatar: profile.picture,
    displayName: profile.name,
    email: profile.email,
    firstName: profile.given_name,
    lastName: profile.family_name,
  };

  let foundUser = (
    await db.update(Users).set(updateObject).where(eq(Users.googleId, updateObject.googleId)).returning()
  )[0];

  if (!foundUser) {
    foundUser = (
      await db
        .insert(Users)
        .values({
          ...updateObject,
        })
        .returning()
    )[0];

    if (!foundUser) {
      throw new AppError(UserErrors.COULD_NOT_CREATE, {
        profile,
      });
    }
  }

  return foundUser;
};

const getUserById = async (userId: string) => {
  const user = (await db.select().from(Users).where(eq(Users.id, userId)))[0];

  if (!user) {
    throw new AppError(UserErrors.NOT_FOUND);
  }

  return user;
};

export { getOrCreateUserWithGoogle, getUserById };
