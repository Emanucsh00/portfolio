const baseUrl = 'https://api.github.com';

async function githubFetch(pathname) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'portfolio-fullstack-app'
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(`${baseUrl}${pathname}`, { headers });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
}

export async function getGithubHistory() {
  const username = process.env.GITHUB_USERNAME;

  if (!username) {
    return {
      username: null,
      profile: null,
      repositories: [],
      recentEvents: []
    };
  }

  const [profile, repositories, recentEvents] = await Promise.all([
    githubFetch(`/users/${username}`),
    githubFetch(`/users/${username}/repos?sort=updated&per_page=6`),
    githubFetch(`/users/${username}/events/public?per_page=10`)
  ]);

  return {
    username,
    profile: {
      login: profile.login,
      name: profile.name,
      avatar_url: profile.avatar_url,
      html_url: profile.html_url,
      bio: profile.bio,
      company: profile.company,
      blog: profile.blog,
      location: profile.location,
      followers: profile.followers,
      following: profile.following,
      public_repos: profile.public_repos,
      public_gists: profile.public_gists,
      created_at: profile.created_at,
      updated_at: profile.updated_at
    },
    repositories: repositories.map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      stargazers_count: repo.stargazers_count,
      language: repo.language,
      updated_at: repo.updated_at
    })),
    recentEvents: recentEvents.map((event) => ({
      id: event.id,
      type: event.type,
      repo: event.repo?.name,
      created_at: event.created_at
    }))
  };
}
