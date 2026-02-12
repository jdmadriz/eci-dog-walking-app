import { Client } from '../../models/client.model';
import { Dog } from '../../models/dog.model';
import { Walk } from '../../models/walk.model';

export const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria@email.com',
    phone: '555-0101',
    address: '123 Oak St',
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: '2',
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james@email.com',
    phone: '555-0102',
    address: '456 Pine Ave',
    createdAt: '2025-02-20T10:00:00Z',
  },
];

export const MOCK_DOGS: Dog[] = [
  {
    id: '1',
    clientId: '1',
    name: 'Buddy',
    breed: 'Golden Retriever',
    age: 3,
    weight: 65,
    notes: 'Very friendly',
    createdAt: '2025-01-16T10:00:00Z',
  },
  {
    id: '2',
    clientId: '1',
    name: 'Luna',
    breed: 'Labrador',
    age: 5,
    weight: 55,
    notes: 'Needs slow walks',
    createdAt: '2025-01-17T10:00:00Z',
  },
  {
    id: '3',
    clientId: '2',
    name: 'Max',
    breed: 'German Shepherd',
    age: 2,
    weight: 75,
    notes: 'High energy',
    createdAt: '2025-01-18T10:00:00Z',
  },
];

export const MOCK_WALKS: Walk[] = [
  {
    id: '1',
    dogId: '1',
    date: '2025-06-10T09:00:00Z',
    duration: 30,
    status: 'completed',
    notes: 'Great walk',
    createdAt: '2025-06-10T09:00:00Z',
  },
  {
    id: '2',
    dogId: '3',
    date: '2025-06-11T14:00:00Z',
    duration: 45,
    status: 'scheduled',
    notes: '',
    createdAt: '2025-06-11T14:00:00Z',
  },
];
