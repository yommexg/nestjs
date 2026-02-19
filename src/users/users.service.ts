import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private users = [
    {
      id: 1,
      name: 'Aisha Thompson',
      email: 'aisha.thompson@example.com',
      role: 'INTERN',
    },
    {
      id: 2,
      name: 'Daniel Rodriguez',
      email: 'daniel.rodriguez@example.com',
      role: 'EMPLOYEE',
    },
    {
      id: 3,
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      role: 'MANAGER',
    },
    {
      id: 4,
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      role: 'EMPLOYEE',
    },
    {
      id: 5,
      name: 'Sofia Martinez',
      email: 'sofia.martinez@example.com',
      role: 'INTERN',
    },
  ];

  findAll(role?: 'INTERN' | 'EMPLOYEE' | 'MANAGER') {
    if (role) {
      const rolesArray = this.users.filter((user) => user.role === role);
      if (rolesArray.length === 0) {
        throw new NotFoundException(`No users found with role ${role}`);
      }
      return rolesArray;
    }
    return this.users;
  }

  findOne(id: number) {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  create(createUserDto: CreateUserDto) {
    const usersByHighestId = this.users.reduce((prev, current) =>
      prev.id > current.id ? prev : current,
    );
    const newUser = { id: usersByHighestId.id + 1, ...createUserDto };
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) return;

    const updatedUser = { ...this.users[userIndex], ...updateUserDto };
    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  remove(id: number) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) return;

    const removedUser = this.users.splice(userIndex, 1)[0];
    return removedUser;
  }
}
