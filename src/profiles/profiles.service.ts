import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  private profiles = [
    {
      id: randomUUID(),
      name: 'Aurelia Montgomery',
      description:
        'A creative and analytical thinker who enjoys solving complex problems.',
    },
    {
      id: randomUUID(),
      name: 'Lennox Carter',
      description:
        'A confident and adaptable individual with strong leadership qualities.',
    },
    {
      id: randomUUID(),
      name: 'Seraphine Delgado',
      description:
        'A compassionate and detail-oriented person who values collaboration.',
    },
  ];

  findAll() {
    return this.profiles;
  }

  findOne(id: string) {
    const matchingProfile = this.profiles.find((prof) => prof.id === id);
    if (!matchingProfile) {
      throw new NotFoundException(`Profile with ID ${id} Not found`);
    }

    return matchingProfile;
  }

  create(createProfileDto: CreateProfileDto) {
    // this.profiles.push({
    //   id: randomUUID(),
    //   name: createProfileDto.name,
    //   description: createProfileDto.description,
    // });
    // return this.profiles;

    const createdProfile = {
      id: randomUUID(),
      ...createProfileDto,
    };

    this.profiles.push(createdProfile);
    return createdProfile;
  }

  update(id: string, updateProfileDto: UpdateProfileDto) {
    const matchingProfile = this.profiles.find((prof) => prof.id === id);
    if (!matchingProfile) {
      throw new NotFoundException(`Profile with ID ${id} Not found`);
    }

    matchingProfile.name = updateProfileDto.name;
    matchingProfile.description = updateProfileDto.description;

    return matchingProfile;
  }

  remove(id: string) {
    const matchingProfileIndex = this.profiles.findIndex(
      (prof) => prof.id === id,
    );
    if (matchingProfileIndex === -1) {
      throw new NotFoundException(`Profile with ID ${id} Not found`);
    }
    this.profiles.splice(matchingProfileIndex, 1);
  }
}
