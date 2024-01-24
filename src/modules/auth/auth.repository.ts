import { RefreshToken } from "src/entities/RefreshToken";
import {
  EntityRepository,
  Repository,
} from "typeorm";

@EntityRepository(RefreshToken)
export class AuthRepository extends Repository<RefreshToken> {
}