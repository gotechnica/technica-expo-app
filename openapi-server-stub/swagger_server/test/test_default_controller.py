# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.inline_response200 import InlineResponse200  # noqa: E501
from swagger_server.models.project import Project  # noqa: E501
from swagger_server.test import BaseTestCase


class TestDefaultController(BaseTestCase):
    """DefaultController integration test stubs"""

    def test_api_challenges_get(self):
        """Test case for api_challenges_get

        
        """
        response = self.client.open(
            '/api/challenges',
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_api_is_published_status_get(self):
        """Test case for api_is_published_status_get

        
        """
        response = self.client.open(
            '/api/is_published_status',
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_api_projects_and_winners_get(self):
        """Test case for api_projects_and_winners_get

        
        """
        response = self.client.open(
            '/api/projects_and_winners',
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_api_projects_generate_projects_list_csv_get(self):
        """Test case for api_projects_generate_projects_list_csv_get

        
        """
        response = self.client.open(
            '/api/projects/generate_projects_list_csv',
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_api_projects_get(self):
        """Test case for api_projects_get

        
        """
        response = self.client.open(
            '/api/projects',
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_api_projects_id_project_id_get(self):
        """Test case for api_projects_id_project_id_get

        
        """
        response = self.client.open(
            '/api/projects/id/{project_id}'.format(project_id='project_id_example'),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_api_publish_winners_status_get(self):
        """Test case for api_publish_winners_status_get

        
        """
        response = self.client.open(
            '/api/publish_winners_status',
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
