import { http, HttpResponse } from 'msw'
import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/types'
import type { Person, Company, ApiResponse } from '@/types'

const passkeyUser = {
  id: '1',
  email: 'passkey@example.com',
  name: 'Passkey User',
  createdAt: new Date().toISOString(),
}

const passwordUser = {
  id: 'tester-1',
  email: 'tester1@example.com',
  name: 'Tester One',
  createdAt: new Date().toISOString(),
}

const authUsersByToken = {
  'mock-passkey-token': passkeyUser,
  'tester1-access-token': passwordUser,
  'mock-refreshed-token': passkeyUser,
} as const

function getAuthenticatedUser(request: Request) {
  const header = request.headers.get('authorization')
  const token = header?.replace('Bearer ', '') ?? ''
  return authUsersByToken[token as keyof typeof authUsersByToken] ?? null
}

const generateCompanies = (): Company[] => {
  const companies: Company[] = []
  for (let i = 1; i <= 15; i++) {
    companies.push({
      id: `comp-${i}`,
      name: `Company ${i}`,
      address: `${100 + i} Main Street, City ${i}`,
      phone: `+1-555-${1000 + i}`,
      email: `contact@company${i}.com`,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    })
  }
  return companies
}

const generatePersons = (companies: Company[]): Person[] => {
  const persons: Person[] = []
  const genders: ('M' | 'F' | 'Other')[] = ['M', 'F', 'M', 'F', 'Other']

  for (let i = 1; i <= 50; i++) {
    const company = companies[i % companies.length]
    const gender = genders[i % genders.length]
    const birthYear = 1970 + (i % 35)
    const birthMonth = (i % 12) + 1
    const birthDay = (i % 28) + 1

    persons.push({
      id: `person-${i}`,
      surname: `Surname${i}`,
      firstName: `FirstName${i}`,
      birthDate: `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`,
      gender,
      companyId: company.id,
      companyName: company.name,
    })
  }
  return persons
}

const mockCompanies = generateCompanies()
let mockPersons = generatePersons(mockCompanies)

function paginate<T>(items: T[], page: number, limit: number) {
  const total = items.length
  const totalPages = Math.ceil(total / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const data = items.slice(startIndex, endIndex)

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  }
}

export const handlers = [
  http.post('/auth/register/options', async () => {
    const options: PublicKeyCredentialCreationOptionsJSON = {
      challenge: 'mock-challenge-base64',
      rp: {
        name: 'Dashboard',
        id: 'localhost',
      },
      user: {
        id: 'user-id',
        name: passkeyUser.email,
        displayName: passkeyUser.name,
      },
      pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
      },
      attestation: 'none',
    }

    return HttpResponse.json(options)
  }),

  http.post('/auth/register/verify', async () => {
    return HttpResponse.json({
      user: passkeyUser,
      accessToken: 'mock-passkey-token',
      expiresAt: Date.now() + 3600000,
    })
  }),

  http.post('/auth/login/options', async () => {
    const options: PublicKeyCredentialRequestOptionsJSON = {
      challenge: 'mock-challenge-base64',
      rpId: 'localhost',
      allowCredentials: [],
      userVerification: 'preferred',
    }

    return HttpResponse.json(options)
  }),

  http.post('/auth/login/verify', async () => {
    return HttpResponse.json({
      user: passkeyUser,
      accessToken: 'mock-passkey-token',
      expiresAt: Date.now() + 3600000,
    })
  }),

  http.post('/auth/login/passkey', async () => {
    return HttpResponse.json({
      user: passkeyUser,
      accessToken: 'mock-passkey-token',
      expiresAt: Date.now() + 3600000,
    })
  }),

  http.post('/auth/refresh', async ({ request }) => {
    const currentUser = getAuthenticatedUser(request)
    if (!currentUser) {
      return HttpResponse.json(
        { code: 'UNAUTHORIZED', message: 'Session refresh failed' },
        { status: 401 }
      )
    }

    return HttpResponse.json({
      accessToken: 'mock-refreshed-token',
      user: currentUser,
      expiresAt: Date.now() + 3600000,
    })
  }),

  http.post('/auth/login/password', async ({ request }) => {
    const body = await request.json() as { username: string; password: string }

    if (body.username === 'tester1' && body.password === 'p0ssw0rd') {
      return HttpResponse.json({
        user: passwordUser,
        accessToken: 'tester1-access-token',
        expiresAt: Date.now() + 3600000,
      })
    }

    return HttpResponse.json(
      { code: 'INVALID_CREDENTIALS', message: 'Invalid username or password' },
      { status: 401 }
    )
  }),

  http.get('/auth/me', async ({ request }) => {
    const user = getAuthenticatedUser(request)

    if (!user) {
      return HttpResponse.json(
        { code: 'UNAUTHORIZED', message: 'Authentication required' },
        { status: 401 }
      )
    }

    return HttpResponse.json(user)
  }),

  http.get('/api/dashboard', async () => {
    return HttpResponse.json({
      projects: 12,
      tasks: 34,
      completed: 89,
    })
  }),

  http.get('/api/persons', async ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const limit = parseInt(url.searchParams.get('limit') || '10', 10)
    const search = url.searchParams.get('search')

    let filteredPersons = [...mockPersons]

    if (search) {
      const searchLower = search.toLowerCase()
      filteredPersons = filteredPersons.filter(
        (person) =>
          person.surname.toLowerCase().includes(searchLower) ||
          person.firstName.toLowerCase().includes(searchLower) ||
          person.companyName.toLowerCase().includes(searchLower)
      )
    }

    const result = paginate(filteredPersons, page, limit)

    return HttpResponse.json<ApiResponse<Person[]>>({
      data: result.data,
      meta: result.meta,
    })
  }),

  http.get('/api/persons/:id', async ({ params }) => {
    const person = mockPersons.find((entry) => entry.id === params.id)

    if (!person) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: 'Person not found' },
        { status: 404 }
      )
    }

    return HttpResponse.json<ApiResponse<Person>>({ data: person })
  }),

  http.post('/api/persons', async ({ request }) => {
    const body = await request.json() as Partial<Person>
    const company = mockCompanies.find((entry) => entry.id === body.companyId)

    const newPerson: Person = {
      id: `person-${Date.now()}`,
      surname: body.surname || '',
      firstName: body.firstName || '',
      birthDate: body.birthDate || '',
      gender: body.gender || 'M',
      companyId: body.companyId || '',
      companyName: company?.name || 'Unknown Company',
    }

    mockPersons.push(newPerson)
    return HttpResponse.json<ApiResponse<Person>>({ data: newPerson }, { status: 201 })
  }),

  http.put('/api/persons/:id', async ({ request, params }) => {
    const body = await request.json() as Partial<Person>
    const index = mockPersons.findIndex((person) => person.id === params.id)

    if (index === -1) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: 'Person not found' },
        { status: 404 }
      )
    }

    let companyName = mockPersons[index].companyName
    if (body.companyId) {
      const company = mockCompanies.find((entry) => entry.id === body.companyId)
      companyName = company?.name || companyName
    }

    mockPersons[index] = {
      ...mockPersons[index],
      ...body,
      companyName,
    }

    return HttpResponse.json<ApiResponse<Person>>({ data: mockPersons[index] })
  }),

  http.delete('/api/persons/:id', async ({ params }) => {
    const index = mockPersons.findIndex((person) => person.id === params.id)

    if (index === -1) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: 'Person not found' },
        { status: 404 }
      )
    }

    mockPersons.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  http.get('/api/companies', async ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const limit = parseInt(url.searchParams.get('limit') || '10', 10)
    const result = paginate(mockCompanies, page, limit)

    return HttpResponse.json<ApiResponse<Company[]>>({
      data: result.data,
      meta: result.meta,
    })
  }),

  http.get('/api/companies/:id', async ({ params }) => {
    const company = mockCompanies.find((entry) => entry.id === params.id)

    if (!company) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: 'Company not found' },
        { status: 404 }
      )
    }

    return HttpResponse.json<ApiResponse<Company>>({ data: company })
  }),

  http.post('/api/companies', async ({ request }) => {
    const body = await request.json() as Partial<Company>

    const newCompany: Company = {
      id: `comp-${Date.now()}`,
      name: body.name || '',
      address: body.address,
      phone: body.phone,
      email: body.email,
      createdAt: new Date().toISOString(),
    }

    mockCompanies.push(newCompany)
    return HttpResponse.json<ApiResponse<Company>>({ data: newCompany }, { status: 201 })
  }),

  http.put('/api/companies/:id', async ({ request, params }) => {
    const body = await request.json() as Partial<Company>
    const index = mockCompanies.findIndex((company) => company.id === params.id)

    if (index === -1) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: 'Company not found' },
        { status: 404 }
      )
    }

    mockCompanies[index] = {
      ...mockCompanies[index],
      ...body,
    }

    mockPersons = mockPersons.map((person) =>
      person.companyId === params.id
        ? { ...person, companyName: mockCompanies[index].name }
        : person
    )

    return HttpResponse.json<ApiResponse<Company>>({ data: mockCompanies[index] })
  }),

  http.delete('/api/companies/:id', async ({ params }) => {
    const index = mockCompanies.findIndex((company) => company.id === params.id)

    if (index === -1) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: 'Company not found' },
        { status: 404 }
      )
    }

    mockCompanies.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
