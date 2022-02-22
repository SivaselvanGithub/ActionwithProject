const core = require('@actions/core');
const github = require('@actions/github');
async function run() {
    const token = core.getInput('token', { required: true });
	  const octokit = github.getOctokit(token)

	const orgProjectsList = []

	// Get all org projects
	const orgProjects = await octokit.rest.projects
		.listForOrg({
			org: github.context.repo.owner,
		})
		.then((result) => {
			// Push repo ids
			result.data.forEach((project) => {
				orgProjectsList.push(project.id)
			})
		})
		.catch((error) => {
			core.setFailed(error.message)
		})

  core.info(`Found ${orgProjectsList.length} organization projects`)

	// Set all projects to private
	if (orgProjectsList.length > 0) {
		orgProjectsList.forEach(async (projectId) => {
      core.info(`Setting project ${projectId} to private...`)
			await octokit.rest.projects.update({
				project_id: projectId,
				private: true,
			})
		})
	}
}

run();

