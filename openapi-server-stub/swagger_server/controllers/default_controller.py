import connexion
import six

from swagger_server.models.inline_response200 import InlineResponse200  # noqa: E501
from swagger_server.models.project import Project  # noqa: E501
from swagger_server import util


def api_challenges_get():  # noqa: E501
    """api_challenges_get

    Get a challenge_list object. # noqa: E501


    :rtype: Dict[str, List[str]]
    """
    return 'do some magic!'


def api_is_published_status_get():  # noqa: E501
    """api_is_published_status_get

    Get whether the app is published. # noqa: E501


    :rtype: str
    """
    return 'do some magic!'


def api_projects_and_winners_get():  # noqa: E501
    """api_projects_and_winners_get

    Get an object containing list of available projects. # noqa: E501


    :rtype: InlineResponse200
    """
    return 'do some magic!'


def api_projects_generate_projects_list_csv_get():  # noqa: E501
    """api_projects_generate_projects_list_csv_get

    Get an HTML table of challenges, companies and projects. # noqa: E501


    :rtype: str
    """
    return 'do some magic!'


def api_projects_get():  # noqa: E501
    """api_projects_get

    Get an object containing list of available projects. # noqa: E501


    :rtype: InlineResponse200
    """
    return 'do some magic!'


def api_projects_id_project_id_get(project_id):  # noqa: E501
    """api_projects_id_project_id_get

    Get details about a project. # noqa: E501

    :param project_id: 
    :type project_id: str

    :rtype: Project
    """
    return 'do some magic!'


def api_publish_winners_status_get():  # noqa: E501
    """api_publish_winners_status_get

    Get whether the expo winners are published. # noqa: E501


    :rtype: str
    """
    return 'do some magic!'
