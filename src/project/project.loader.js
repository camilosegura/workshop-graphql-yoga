import Dataloader from 'dataloader';
import Project from './project.model';

export default () => new Dataloader(async (userIds) => {
  const projects = await Project.find({ users: {$in: userIds} }).populate('users');

  const projectsUsers = userIds.map((id) => {
    return projects.filter((project) => {
      return project.users.some((user) => String(user._id) === String(id));
    })
  });

  return projectsUsers;
});
